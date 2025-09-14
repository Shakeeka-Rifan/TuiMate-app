const axios = require('axios');
const Class = require('../models/Class');
const Tutor = require('../models/Tutor');


const MIN_CONFIDENCE = 6; // 1..10 (raise to be stricter)

/** Reverse-geocode to verify the coords are a real place and loosely match the text */
async function verifyCoordsMatchText(lat, lng, text) {
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${process.env.OPENCAGE_API_KEY}&limit=1&no_annotations=1`;
  const { data } = await axios.get(url);
  const best = data?.results?.[0];
  if (!best || !best.geometry || best.confidence < MIN_CONFIDENCE) {
    return { ok: false, reason: 'Location not precise enough' };
  }

  // soft text check to avoid false negatives due to formatting differences
  const norm = s => (s || '').toLowerCase().trim();
  const provided = norm(text).split(',')[0];  // compare first token
  const formatted = norm(best.formatted);
  if (provided && !formatted.includes(provided)) {
    // keep it soft; if you want hard fail, return an error here
    // return { ok:false, reason:'Location text does not match coordinates' };
  }

  return { ok: true, formatted: best.formatted };
}


// POST /api/classes/create
// POST /api/classes/create
exports.createClass = async (req, res) => {
  const {
    tutorId, subject, date, startTime, endTime, fee,
    batchSize, grade, classType, location, latitude, longitude
  } = req.body;

  try {
    // -------- basic required fields ----------
    if (
      !tutorId || !subject || !date || !startTime || !endTime ||
      fee == null || batchSize == null || !grade || !classType || !location
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // -------- numeric coord validation ----------
    if (
      typeof latitude !== 'number' || typeof longitude !== 'number' ||
      Number.isNaN(latitude) || Number.isNaN(longitude) ||
      latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180
    ) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    // -------- server-side reverse geocode verification ----------
    let normalizedAddress = location;
    try {
      const check = await verifyCoordsMatchText(latitude, longitude, location);
      if (!check.ok) return res.status(400).json({ message: `Invalid location: ${check.reason}` });
      normalizedAddress = check.formatted || location; // store canonical formatted address
    } catch (e) {
      console.error('Reverse geocoding failed:', e.message);
      return res.status(400).json({ message: 'Location verification failed' });
    }

    // -------- time overlap check ----------
    const toMinutes = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const newStart = toMinutes(startTime);
    const newEnd   = toMinutes(endTime);

    const sameDay = await Class.find({ tutor: tutorId, date });
    const conflict = sameDay.some(existing =>
      newStart < toMinutes(existing.endTime) && newEnd > toMinutes(existing.startTime)
    );
    if (conflict) {
      return res.status(409).json({ message: 'Class time overlaps with an existing class.' });
    }

    // -------- save ----------
    const newClass = new Class({
      tutor: tutorId,
      subject,
      date,
      startTime,
      endTime,
      fee,
      batchSize,
      grade,
      classType,
      location: normalizedAddress,
      latitude,
      longitude,
    });

    await newClass.save();

    // -------- maintain tutor subjects ----------
    const tutor = await Tutor.findById(tutorId);
    if (tutor && !tutor.subjects.includes(subject)) {
      tutor.subjects.push(subject);
      await tutor.save();
    }

    return res.status(201).json({ message: 'Class created successfully', class: newClass });
  } catch (error) {
    console.error('❌ Class creation error:', error);
    return res.status(500).json({ message: 'Server error while creating class' });
  }
};

// GET /api/classes/tutor/:tutorId?date=...&status=...
exports.getClassesForTutor = async (req, res) => {
  const tutorId = req.params.tutorId;
  const { date, status } = req.query;

  try {
    const filter = { tutor: tutorId, ...(date && { date }), ...(status && status !== 'All' && { status }) };
    const classes = await Class.find(filter).sort({ date: 1, startTime: 1 });
    return res.status(200).json(classes);
  } catch (err) {
    console.error('Error fetching tutor classes:', err);
    return res.status(500).json({ message: 'Server error while fetching classes' });
  }
};

  



// GET /api/classes/tutor/:tutorId?date=...&status=...
exports.getClassesForTutor = async (req, res) => {
  const tutorId = req.params.tutorId;
  const { date, status } = req.query;

  try {
    let filter = { tutor: tutorId };

    if (date) {
      filter.date = date;
    }

    if (status && status !== 'All') {
      filter.status = status; // Class model must have status field
    }

    const classes = await Class.find(filter).sort({ date: 1, startTime: 1 });
   

    res.status(200).json(classes);
  } catch (err) {
    console.error('Error fetching tutor classes:', err);
    res.status(500).json({ message: 'Server error while fetching classes' });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classId = req.params.classId;
    const cls = await Class.findById(classId);

    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(cls);
  } catch (err) {
    console.error('Error fetching class by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};





exports.markClassCompleted = async (req, res) => {
  try {
    const classId = req.params.classId;
    const cls = await Class.findById(classId);

    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    cls.status = 'Completed'; // You need to add a 'status' field in Class model
    await cls.save();

    res.json({ message: 'Class marked as completed' });
  } catch (err) {
    console.error('Error marking class completed:', err);
    res.status(500).json({ message: 'Error marking class completed' });
  }
};

exports.cancelClass = async (req, res) => {
  try {
    const classId = req.params.classId;
    const cls = await Class.findById(classId);

    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    cls.status = 'Cancelled'; // You need to add a 'status' field in Class model
    await cls.save();

    res.json({ message: 'Class cancelled' });
  } catch (err) {
    console.error('Error cancelling class:', err);
    res.status(500).json({ message: 'Error cancelling class' });
  }
};


