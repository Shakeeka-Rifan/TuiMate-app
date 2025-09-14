// routes/bookings.js
const express = require('express');
const router = express.Router();

const bookingController = require('../controllers/bookingController');

// Create booking
router.post('/create', bookingController.createBooking);

// Get tutor's booking requests
router.get('/tutor/:tutorId/bookings', bookingController.getBookingsForTutor);

// Tutor accepts request
router.patch('/:id/accept', bookingController.acceptBooking);

// Tutor declines request
router.patch('/:id/decline', bookingController.declineBooking);
router.get('/student/:studentId/bookings', bookingController.getBookingsByStudent);
router.patch('/booking/:bookingId/attendance', bookingController.markAttendanceStatus);


module.exports = router;
