// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const path = require('path');
const { studentSignup, studentLogin ,tutorSignup, tutorLogin, updateStudentProfile} = require('../controllers/authController');

// 📦 Multer setup for NIC image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/tutors/');
    },
    filename: function (req, file, cb) {
      cb(null, `nic_${Date.now()}${path.extname(file.originalname)}`);
    },
  });

  const upload = multer({ storage });

  // New upload for student profile
const studentUpload = require('../config/studentMulter');

// ✅ Tutor signup with NIC image
router.post('/tutors/signup', upload.single('nicImage'), tutorSignup);
router.post('/tutors/login', tutorLogin);

// Routes for Student Authentication
router.post('/students/signup', studentSignup);
router.post('/students/login', studentLogin);

router.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching student', error });
  }
});


router.post('/students/upload/:id', studentUpload.single('image'), async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { profileImage: req.file.path },
      { new: true }
    );

    res.status(200).json({ message: 'Image uploaded', imageUrl: student.profileImage });
  } catch (err) {
    res.status(500).json({ message: 'Image upload failed', error: err });
  }
});

// ✅ Update student profile (name, email, grade, and optional profileImage)
router.put(
  '/students/update/:id',
  (req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
      studentUpload.single('profileImage')(req, res, next);
    } else {
      studentUpload.none()(req, res, next); // handle form-data with no file
    }
  },
  updateStudentProfile
);


router.put('/students/change-password/:id', async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error changing password', error });
  }
});




module.exports = router;
