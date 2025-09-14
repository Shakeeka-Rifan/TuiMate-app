// controllers/aiController.js
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');
const Class = require('../models/Class');
const fetch = require('node-fetch');
const { OpenAI } = require('openai');

/* =================== Config =================== */
const RANKER_URL = process.env.RANKER_URL || 'http://127.0.0.1:8001/rank';
const hasOpenAIKey = !!process.env.OPENAI_API_KEY;
const openai = hasOpenAIKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

/* =================== Shared helpers =================== */
const toClassDate = (c) => new Date(`${c.date}T${c.startTime || '00:00'}`);

const pickBestClass = (classes = []) => {
  const now = new Date();

  const withCoords = classes.filter(
    (c) => typeof c.latitude === 'number' && typeof c.longitude === 'number'
  );

  const upcomingWithCoords = withCoords
    .filter((c) => toClassDate(c) >= now)
    .sort((a, b) => toClassDate(a) - toClassDate(b));
  if (upcomingWithCoords[0]) return upcomingWithCoords[0];

  const anyWithCoords = withCoords.sort((a, b) => toClassDate(a) - toClassDate(b));
  if (anyWithCoords[0]) return anyWithCoords[0];

  const upcomingAny = classes
    .filter((c) => toClassDate(c) >= now)
    .sort((a, b) => toClassDate(a) - toClassDate(b));
  if (upcomingAny[0]) return upcomingAny[0];

  return classes.sort((a, b) => toClassDate(a) - toClassDate(b))[0] || null;
};

// Enrich bare tutor docs with "best class" fields your frontend expects
async function enrichWithBestClass(tutors) {
  const ids = tutors.map((t) => t._id);
  if (!ids.length) return [];

  const classes = await Class.find({ tutor: { $in: ids } })
    .select('tutor date startTime grade location latitude longitude subject fee')
    .lean();

  const byTutor = new Map(ids.map((id) => [String(id), []]));
  for (const c of classes) {
    const key = String(c.tutor);
    if (!byTutor.has(key)) byTutor.set(key, []);
    byTutor.get(key).push(c);
  }

  return tutors.map((tutor) => {
    const tclasses = byTutor.get(String(tutor._id)) || [];
    const best = pickBestClass(tclasses);

    return {
      _id: tutor._id,
      name: tutor.name,
      subjects: tutor.subjects || [],
      profileImage: tutor.profileImage,
      rating: tutor.rating || { value: 0, count: 0 },

      // 👇 fields used by your RN cards
      grade: best?.grade || 'N/A',
      subject: best?.subject || (tutor.subjects?.[0] || 'N/A'),
      fee: best?.fee ?? 'N/A',
      location: best?.location || tutor.location || 'Unknown Location',

      // distance helpers in your UI look for coords on the tutor object
      latitude: typeof best?.latitude === 'number' ? best.latitude : tutor.latitude,
      longitude: typeof best?.longitude === 'number' ? best.longitude : tutor.longitude,
    };
  });
}

// Simple rule-based score (Node fallback)
function ruleScoreNode(student, t) {
  const prefs = student?.preferences || {};
  const sSub = new Set(prefs.subjects || []);
  const sTime = new Set(prefs.studyTime || []);
  const sGender = prefs.genderPreference || null;

  const tSubs = t.subjects || [];
  const tAvail = t.availability || [];
  const tGender = t.gender || null;
  const rating = Math.max(0, Math.min(5, t?.rating?.value || 0));

  const subjectMatch = tSubs.some((x) => sSub.has(x)) ? 1 : 0;
  const timeOverlap =
    tAvail.length && sTime.size ? (tAvail.some((x) => sTime.has(x)) ? 1 : 0) : 0.5;
  const genderMatch = sGender ? (tGender === sGender ? 1 : 0) : 0.5;
  const ratingNorm = rating / 5;

  return 1.0 * subjectMatch + 0.8 * timeOverlap + 0.5 * ratingNorm + 0.3 * genderMatch;
}

function rankByRulesNode(student, tutors, topK = 3) {
  return tutors
    .map((t) => ({ t, s: ruleScoreNode(student, t) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, topK)
    .map(({ t }) => t);
}

async function callLocalRanker(studentPrefs, tutors, topK = 3) {
  const resp = await fetch(RANKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentPrefs, tutors, topK }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Local ranker error: ${resp.status} ${text}`);
  }
  return resp.json(); // { results: [{ _id, name, score, reason }, ...] }
}

/* =================== Controller =================== */

exports.getAIMatchedTutors = async (req, res) => {
  const studentId = req.params.id;

  let student;
  try {
    // 1) Student + init credits for old docs
    student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (student.aiCredits == null) {
      student.aiCredits = 3;
      await student.save();
    }

    // 2) Candidate tutors
    const allTutors = await Tutor.find({ isApproved: true }).lean();
    if (!allTutors.length) return res.json([]);

    // 3) Gate
    const isPro = !!student.isPro;
    if (!isPro && student.aiCredits <= 0) {
      return res.status(403).json({
        message: 'No AI credits left. Upgrade to Pro to use AI Match.',
        remainingCredits: 0,
      });
    }

    const prefs = student.preferences || {};

    /* ---------- PATH A: OpenAI (if key set) ---------- */
    if (hasOpenAIKey) {
      try {
        const sj = (arr) => (Array.isArray(arr) && arr.length ? arr.join(', ') : 'N/A');

        const tutorListStr = allTutors
          .map(
            (t) =>
              `${t.name} | Subjects: ${sj(t.subjects)} | Rating: ${
                t?.rating?.value || 0
              } | Availability: ${sj(t.availability)}`
          )
          .join('\n');

        const prompt = `
You're an intelligent AI helping students find tutors. Here is a list of tutors:

${tutorListStr}

Match based on:
- Subjects
- Availability (study time match)
- Class type (if available)

Student preferences:
Subjects: ${sj(prefs.subjects)}
Study Time: ${sj(prefs.studyTime)}
Class Type: ${prefs.classType || 'N/A'}

Return ONLY the best top 3 tutor NAMES from the list above as a numbered list like:
1. Name A
2. Name B
3. Name C
`;

        const completion = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
        });

        const aiText = completion.choices?.[0]?.message?.content || '';
        const names = aiText
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => /^\d+\.\s*/.test(l))
          .map((l) => l.replace(/^\d+\.\s*/, '').trim())
          .filter(Boolean);

        let matched = [];
        if (names.length) {
          const byName = new Set(names.map((n) => n.toLowerCase()));
          matched = allTutors.filter((t) => {
            const nm = (t.name || '').toLowerCase();
            return Array.from(byName).some((n) => nm.includes(n));
          });
        }

        if (matched.length) {
          const top3 = matched.slice(0, 3);
          const enriched = await enrichWithBestClass(top3); // 👈 ensure grade/fee/location/coords
          if (!isPro) await Student.findByIdAndUpdate(studentId, { $inc: { aiCredits: -1 } });
          return res.json(enriched);
        }
        // else fall through to local ranker
      } catch (err) {
        console.error('OpenAI path failed:', err?.code || err?.status || err?.message);
        // keep going to local ranker
      }
    }

    /* ---------- PATH B: Local ranker (free) ---------- */
    try {
      const rankResp = await callLocalRanker(prefs, allTutors, 3);
      const results = rankResp?.results || [];
      const ids = results.map((r) => String(r._id));
      const byId = new Map(allTutors.map((t) => [String(t._id), t]));
      const matched = ids.map((id) => byId.get(id)).filter(Boolean);

      if (matched.length) {
        const enriched = await enrichWithBestClass(matched); // 👈 enrich here too
        if (!isPro) await Student.findByIdAndUpdate(studentId, { $inc: { aiCredits: -1 } });
        return res.json(enriched);
      }
      // else fall to rules
    } catch (err) {
      console.error('Local ranker path failed:', err?.message || err);
    }

    /* ---------- PATH C: Rule-based fallback ---------- */
    const ruleTopDocs = rankByRulesNode(student, allTutors, 3);
    const enriched = await enrichWithBestClass(ruleTopDocs);
    if (!isPro && enriched.length) {
      await Student.findByIdAndUpdate(studentId, { $inc: { aiCredits: -1 } });
    }
    return res.json(enriched);
  } catch (e) {
    console.error('AI Match fatal error:', e);
    return res.status(500).json({ message: 'AI Match failed' });
  }
};
