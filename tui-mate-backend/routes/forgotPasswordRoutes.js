// PART 1: Backend - routes/forgotPasswordRoutes.js
const express = require('express');
const router = express.Router();
const { sendOtpToEmail, verifyOtpAndResetPassword } = require('../controllers/forgotPasswordController');
const { sendTutorOTP, verifyTutorOTPAndReset } = require('../controllers/tutorAuthController');


router.post('/send-otp', sendOtpToEmail);
router.post('/verify-otp', verifyOtpAndResetPassword);
router.post('/tutor/receive-otp', sendTutorOTP);
router.post('/tutor/veri-otp', verifyTutorOTPAndReset);


module.exports = router;