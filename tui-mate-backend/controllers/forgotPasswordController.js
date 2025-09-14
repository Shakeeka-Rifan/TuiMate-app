// PART 2: Backend - controllers/forgotPasswordController.js
const Student = require('../models/Student');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

let otpStore = {}; // In-memory. You can replace with Redis or DB.

exports.sendOtpToEmail = async (req, res) => {
  const { email } = req.body;
  const student = await Student.findOne({ email });

  if (!student) return res.status(404).json({ message: 'Student not found' });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[email] = { code: otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

  const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'shakeekarifan2@gmail.com',
    pass: 'fyhytxnuyekkeajl' // ← your 16-digit App Password
  }
});

  await transporter.sendMail({
  from: '"TuiMate Support" <no-reply@tuimate.com>',
  to: email,
  subject: 'TuiMate Password Reset - Your OTP Code',
  html: `
    <div style="font-family:Arial, sans-serif; padding:10px;">
      <h2>Hello,</h2>
      <p>Here is your OTP code to reset your TuiMate account password:</p>
      <h1 style="background:#fbbc05; padding:10px; display:inline-block; color:white;">${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <br/>
      <strong>– TuiMate Team</strong>
    </div>
  `
});

  res.json({ message: 'OTP sent to email.' });
};

exports.verifyOtpAndResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const record = otpStore[email];

  if (!record || record.code !== otp || record.expiresAt < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await Student.findOneAndUpdate({ email }, { password: hashed });

  delete otpStore[email];
  res.json({ message: 'Password reset successful.' });
};
