// controllers/tutorController.js
const Tutor = require('../models/Tutor');
const path = require('path');
const Review = require('../models/Review');
const bcrypt = require('bcrypt');

const Class = require('../models/Class');


/** tiny helpers */
const toArray = (v) => {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  // try JSON array
  if (typeof v === 'string') {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed;
    } catch (_) {}
    // fallback: comma-separated string
    return v.split(',').map(s => s.trim()).filter(Boolean);
  }
  return [String(v)];
};

exports.updateTutorProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body || {};

    const tutor = await Tutor.findById(id);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

    // Unique email guard
    if (body.email && body.email !== tutor.email) {
      const exists = await Tutor.findOne({ email: body.email, _id: { $ne: id } });
      if (exists) return res.status(400).json({ message: 'Email already in use' });
      tutor.email = body.email;
    }

    if (body.name != null) tutor.name = body.name;
    if (body.nic != null) tutor.nic = body.nic;
    if (body.qualification != null) tutor.qualification = body.qualification;

    if (body.gender != null) {
      const allowed = ['Male', 'Female', 'Other'];
      if (!allowed.includes(body.gender)) {
        return res.status(400).json({ message: 'Invalid gender' });
      }
      tutor.gender = body.gender;
    }

    if (body.subjects != null) tutor.subjects = toArray(body.subjects);
    if (body.availability != null) tutor.availability = toArray(body.availability);
    if (body.grades != null) tutor.grades = toArray(body.grades);

    if (body.location != null) tutor.location = body.location;

    if (body.fee != null) {
      const n = Number(body.fee);
      if (Number.isNaN(n) || n < 0) return res.status(400).json({ message: 'Invalid fee' });
      tutor.fee = n;
    }

    // If the frontend sent a new image path from the /upload route
    if (body.profileImage) {
      tutor.profileImage = String(body.profileImage).replace(/\\/g, '/');
    }

    await tutor.save();

    return res.json({
      _id: tutor._id,
      name: tutor.name,
      email: tutor.email,
      nic: tutor.nic,
      qualification: tutor.qualification,
      gender: tutor.gender,
      subjects: tutor.subjects,
      availability: tutor.availability,
      grades: tutor.grades,
      fee: tutor.fee,
      location: tutor.location,
      profileImage: tutor.profileImage,
      isApproved: tutor.isApproved,
      approved: tutor.approved,
    });
  } catch (err) {
    console.error('Update tutor error:', err);
    return res.status(500).json({ message: 'Server error while updating tutor' });
  }
};

exports.uploadProfileImage = async (req, res) => {
  const tutorId = req.params.id;
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

    tutor.profileImage = req.file.path.replace(/\\/g, '/');
    await tutor.save();

    res.status(200).json({ imageUrl: tutor.profileImage });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTutorById = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });
    res.json(tutor);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tutor' });
  }
};

exports.getTutorDetails = async (req, res) => {
  try {
    const tutorId = req.params.id;

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    const subject = req.query.subject;
const classes = await Class.find({
  tutor: tutorId,
  ...(subject && { subject })
}).sort({ date: 1 });

    const firstClass = classes[0];

    res.json({
      name: tutor.name,
      subjects: tutor.subjects,
      fee: firstClass ? firstClass.fee : tutor.fee || 'N/A',
      location: firstClass ? firstClass.location : (tutor.location || 'Unknown Location'),
      profileImage: tutor.profileImage || null,
        rating: tutor.rating || { value: 4, count: 0 }, // ⭐ PUT IT HERE (correct place),
      classes: classes.map(cls => ({
        _id: cls._id, 
        id: cls._id,
        date: cls.date,
        startTime: cls.startTime,
        endTime: cls.endTime,
        grade: cls.grade || 'N/A',
        latitude: cls.latitude || 7.8731,
  longitude: cls.longitude || 80.7718,
  
      })),
    });
  } catch (error) {
    console.error('Error fetching tutor details:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.changeTutorPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Missing currentPassword or newPassword' });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    const tutor = await Tutor.findById(id);
    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

    const ok = await bcrypt.compare(currentPassword, tutor.password);
    if (!ok) return res.status(401).json({ message: 'Current password is incorrect' });

    const same = await bcrypt.compare(newPassword, tutor.password);
    if (same) return res.status(400).json({ message: 'New password must be different from the current password' });

    tutor.password = await bcrypt.hash(newPassword, 10);
    await tutor.save();

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ message: 'Server error while changing password' });
  }
};
