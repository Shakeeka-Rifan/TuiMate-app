const Tutor = require('../models/Tutor');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

let tutorOtps = {}; // In-memory store

// Send OTP
exports.sendTutorOTP = async (req, res) => {
  const { email } = req.body;
  const tutor = await Tutor.findOne({ email });
  if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  tutorOtps[email] = otp;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
   auth: {
    user: 'shakeekarifan2@gmail.com',
    pass: 'fyhytxnuyekkeajl' // ← your 16-digit App Password
  }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'TuiMate Tutor Password Reset OTP',
    text: `Your OTP is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

// Verify OTP & Reset Password
exports.verifyTutorOTPAndReset = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const validOtp = tutorOtps[email];

  if (otp !== validOtp) return res.status(400).json({ message: 'Invalid OTP' });

  const tutor = await Tutor.findOne({ email });
  if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

 const bcrypt = require('bcryptjs');
tutor.password = await bcrypt.hash(newPassword, 10);
await tutor.save();


  delete tutorOtps[email];

  res.json({ message: 'Password updated successfully' });
};
