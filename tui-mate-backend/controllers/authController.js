// backend/controllers/authController.js
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Student Signup
exports.studentSignup = async (req, res) => {
  const { name, email, grade, password } = req.body;

  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) return res.status(400).json({ message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ name, email, grade, password: hashedPassword });

    await newStudent.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Signup error', error });
  }
};

// Student Login
exports.studentLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const student = await Student.findOne({ email });
      if (!student) {
        return res.status(400).json({ message: 'Student not found' });
      }
  
      // ✅ Compare hashed password
      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Optionally generate JWT
      const token = jwt.sign({ id: student._id }, 'your_secret_key', { expiresIn: '1d' });
  
      res.status(200).json({
        message: 'Login successful',
        student,
        token,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };

  
// Update student profile
// controllers/authController.js
// backend/controllers/authController.js

exports.updateStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;
    student.grade = req.body.grade || student.grade;

    // ✅ Preserve existing image if no new image uploaded
    if (req.file) {
      student.profileImage = req.file.path;
    } else if (!student.profileImage) {
      student.profileImage = ''; // Optional: handle empty case if needed
    }

    await student.save();

    console.log('req.body:', req.body);
console.log('req.file:', req.file);


    // ✅ Always return full updated object with correct image URL
    res.status(200).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      grade: student.grade,
 profileImage: `http://172.20.10.3:5000/${student.profileImage?.replace(/\\/g, '/')}`,



    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err });
  }
};



  // 📌 Tutor Signup
exports.tutorSignup = async (req, res) => {
    const { name, email, nic, qualification, subjects, gender ,password } = req.body;
    const nicImage = req.file?.path;
  
    try {
      const existingTutor = await Tutor.findOne({ email });
      if (existingTutor) {
        return res.status(400).json({ message: 'Tutor with this email already exists' });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const availability = JSON.parse(req.body.availability || '[]');

      const newTutor = new Tutor({
        name,
        email,
        nic,
        qualification,
        gender ,
       subjects: req.body.subjects.split(',').map(s => s.trim()), // ⭐ split comma-separated subjects
        password: hashedPassword,
         availability: availability, // ⭐ save array
        nicImage,
        approved: false, // wait for admin approval
      });
  
      await newTutor.save();
      res.status(201).json({ message: 'Tutor registered. Awaiting admin approval.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Tutor signup failed', error });
    }
  };
  
  // 📌 Tutor Login
  exports.tutorLogin = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const tutor = await Tutor.findOne({ email });
      if (!tutor) {
        return res.status(404).json({ message: 'Tutor not found' });
      }
  
      const isMatch = await bcrypt.compare(password, tutor.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      // Optional: Block login if not approved
      if (!tutor.isApproved) {
        return res.status(403).json({ message: 'Your account is not yet approved by the admin.' });
      }
  
      const token = jwt.sign({ id: tutor._id }, 'your_secret_key', { expiresIn: '1d' });
  
      res.status(200).json({
        message: 'Login successful',
        tutor,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Login failed', error });
    }
  };
  
