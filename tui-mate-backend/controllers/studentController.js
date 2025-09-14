// controllers/studentController.js
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');
const Class = require('../models/Class');



// helpers to pick the right class (next upcoming with coords)
const toClassDate = (c) => new Date(`${c.date}T${c.startTime || '00:00'}`);

const pickBestClass = (classes = []) => {
  const now = new Date();

  // 1) upcoming classes that have coords
  const upcomingWithCoords = classes
    .filter(c => typeof c.latitude === 'number' && typeof c.longitude === 'number')
    .filter(c => toClassDate(c) >= now)
    .sort((a, b) => toClassDate(a) - toClassDate(b));
  if (upcomingWithCoords[0]) return upcomingWithCoords[0];

  // 2) any class with coords (closest by time)
  const anyWithCoords = classes
    .filter(c => typeof c.latitude === 'number' && typeof c.longitude === 'number')
    .sort((a, b) => toClassDate(a) - toClassDate(b));
  if (anyWithCoords[0]) return anyWithCoords[0];

  // 3) fallback: upcoming (even if no coords)
  const upcomingAny = classes
    .filter(c => toClassDate(c) >= now)
    .sort((a, b) => toClassDate(a) - toClassDate(b));
  if (upcomingAny[0]) return upcomingAny[0];

  // 4) absolute fallback: earliest class
  return classes.sort((a, b) => toClassDate(a) - toClassDate(b))[0] || null;
};


exports.savePreferences = async (req, res) => {
  const studentId = req.params.id;
  const { subjects, studyTime, classType, genderPreference  } = req.body;



  if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ message: 'Please select at least one subject.' });
  }

  if (!studyTime || !classType || !genderPreference ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    student.preferences = {
      subjects,
      studyTime,
      classType,
      genderPreference,
    };

    student.quizCompleted = true;

    await student.save();

    res.status(200).json({ message: 'Preferences saved successfully' });
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ message: 'Server error while saving preferences' });
  }
};



// ✅ Updated getRecommendedTutors
// ✅ Next-class-aware recommended tutors
exports.getRecommendedTutors = async (req, res) => {
  const studentId = req.params.id;

  try {
    const student = await Student.findById(studentId);
    if (
      !student?.preferences?.subjects ||
      !student?.preferences?.genderPreference
    ) {
      return res.status(400).json({ message: 'Incomplete preferences' });
    }

    const { subjects, classType, studyTime, genderPreference } = student.preferences;

    const tutors = await Tutor.find({
      subjects: { $in: subjects },
      isApproved: true,
      gender: genderPreference,
      $or: [
        { availability: { $in: studyTime } },
        { availability: { $size: 0 } },
      ],
    }).lean();

    const result = await Promise.all(
      tutors.map(async (tutor) => {
        // pull classes relevant to the student’s prefs
        const tutorClasses = await Class.find({
          tutor: tutor._id,
          classType,
          subject: { $in: subjects },
        })
          .select('date startTime grade location latitude longitude subject fee')
          .lean();

        const best = pickBestClass(tutorClasses);

        return {
          _id: tutor._id,
          name: tutor.name,
          subjects: tutor.subjects,
          profileImage: tutor.profileImage,
          rating: tutor.rating,

          // prefer the best (next) class details; fallback to tutor-level/labels
          grade: best?.grade || 'N/A',
          location: best?.location || tutor.location || 'Unknown Location',
          latitude: typeof best?.latitude === 'number' ? best.latitude : tutor.latitude,
          longitude: typeof best?.longitude === 'number' ? best.longitude : tutor.longitude,
          subject: best?.subject || subjects?.[0] || 'N/A',
          fee: best?.fee ?? 'N/A',

          hasClass: tutorClasses.length > 0,
        };
      })
    );

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ message: 'Server error while fetching recommended tutors' });
  }
};

// At the bottom of studentController.js:
// Search tutors controller
// controllers/searchController.js


// ✅ Next-class-aware search results
exports.searchTutors = async (req, res) => {
  try {
    const { subject, grade, location, feeRange, gender } = req.query;

    const tutorFilter = { isApproved: true };
    if (subject && subject.trim()) tutorFilter.subjects = { $in: [subject.trim()] };
    if (location) tutorFilter.location = new RegExp(location, 'i');
    if (gender) tutorFilter.gender = gender;

    const tutors = await Tutor.find(tutorFilter).lean();
    const tutorIds = tutors.map(t => t._id);

    // Build class filter once, fetch ALL classes for the listed tutors
    const classFilter = { tutor: { $in: tutorIds } };
    if (subject) classFilter.subject = subject;
    if (grade) classFilter.grade = grade;
    if (feeRange) {
      const [minFee, maxFee] = feeRange.split('-').map(Number);
      classFilter.fee = { $gte: minFee, $lte: maxFee };
    }

    const classes = await Class.find(classFilter)
      .select('tutor date startTime grade location latitude longitude subject fee')
      .lean();

    // Group classes by tutor, pick the best one per tutor
    const results = tutors.map((tutor) => {
      const tutorClasses = classes.filter(c => String(c.tutor) === String(tutor._id));
      const best = pickBestClass(tutorClasses);

      // If you ONLY want tutors that have matching classes, keep this guard:
      if (!best) return null;

      return {
        ...tutor,
        grade: best.grade || 'N/A',
        location: best.location || tutor.location || 'Unknown Location',
        subject: best.subject || subject || 'N/A',
        fee: best.fee ?? 'N/A',

        // IMPORTANT: set coords to the best class so your current frontend distance works
        latitude: typeof best.latitude === 'number' ? best.latitude : tutor.latitude,
        longitude: typeof best.longitude === 'number' ? best.longitude : tutor.longitude,

        rating: {
          value: tutor.rating?.value ?? 0,
          count: tutor.rating?.count ?? 0,
        },
      };
    });

    res.json(results.filter(Boolean));
  } catch (error) {
    console.error('Error in searchTutors:', error);
    res.status(500).json({ message: 'Server error while searching tutors' });
  }
};
