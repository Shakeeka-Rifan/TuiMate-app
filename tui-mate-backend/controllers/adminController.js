const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Tutor = require('../models/Tutor'); // Adjust path if different
const Student = require('../models/Student'); // Adjust path if different
const sendEmail = require('../utils/sendEmail');

// Admin Login
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token, message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

exports.getPendingTutors = async (req, res) => {
  try {
    const pendingTutors = await Tutor.find({ isApproved: false });
    res.json(pendingTutors);
  } catch (err) {
    console.error('❌ Error fetching pending tutors:', err);
    res.status(500).json({ message: 'Failed to fetch pending tutors' });
  }
};


exports.approveTutor = async (req, res) => {
  try {
    const tutor = await Tutor.findById(req.params.id);

    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    if (tutor.isApproved) {
      return res.status(400).json({ message: 'Tutor already approved' });
    }

    tutor.isApproved = true;
    await tutor.save();

    // Send confirmation email
   const emailBody = `
  <h3>Dear ${tutor.name},</h3>
  <p>Your tutor account has been approved. You can now log in using your registered email and password through the TuiMate mobile app.</p>
  <br><p>Best regards,<br>TuiMate Team</p>
`;

    await sendEmail(tutor.email, 'Tutor Approval Confirmation - TuiMate', emailBody);

    res.json({ message: 'Tutor approved and email sent successfully' });
  } catch (error) {
    console.error('Approval Error:', error);
    res.status(500).json({ message: 'Server error during tutor approval' });
  }
};

// List all students

exports.getStudentsAdmin = async (req, res) => {
  try {
    const students = await Student.find().lean();
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Error fetching students' });
  }
};

exports.getTutorsAdmin= async (req, res) => {
  try {
    const tutors = await Tutor.find().lean();
    res.status(200).json(tutors);
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ message: 'Error fetching tutors' });
  }
};

