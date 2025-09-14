// controllers/bookingController.js
const Booking = require('../models/Booking');
const Class = require('../models/Class');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');


// Create new booking
// controllers/bookingController.js

exports.createBooking = async (req, res) => {
  try {
    const { tutorId, studentId, classId } = req.body;

    // ✅ Check if already booked
    const existingBooking = await Booking.findOne({ tutorId, studentId, classId });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this class.' });
    }

    // ✅ Fetch class info
    const selectedClass = await Class.findById(classId);
    if (!selectedClass) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    // ✅ 🔒 Prevent booking past classes
    const classDateTime = new Date(`${selectedClass.date}T${selectedClass.startTime}`);
    const now = new Date();
    if (classDateTime < now) {
      return res.status(400).json({ message: 'Cannot book past classes.' });
    }

    // ✅ Check overlapping bookings for same student
    const sameDayBookings = await Booking.find({
      studentId,
      status: { $in: ['Pending', 'Accepted'] }
    }).populate('classId');

    const isOverlapping = sameDayBookings.some(booking => {
      const cls = booking.classId;
      if (!cls) return false;
      return (
        cls.date === selectedClass.date &&
        cls.startTime === selectedClass.startTime
      );
    });

    if (isOverlapping) {
      return res.status(400).json({
        message: 'You have already booked another class at the same time.'
      });
    }

    // ✅ Create booking
    const booking = new Booking({
      tutorId,
      studentId,
      classId,
      status: 'Pending'
    });

    await booking.save();

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Booking create error:', error);
    res.status(500).json({ message: 'Server error while creating booking' });
  }
};




// Get tutor's pending booking requests
// Get bookings for tutor
exports.getBookingsForTutor = async (req, res) => {
  const tutorId = req.params.tutorId;

  try {
    const bookings = await Booking.find({ tutorId }).populate('studentId classId');
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching tutor bookings:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
};

// Accept booking
exports.acceptBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'Accepted';
    await booking.save();

    res.status(200).json({ message: 'Booking accepted' });
  } catch (error) {
    console.error('Error accepting booking:', error);
    res.status(500).json({ message: 'Server error while accepting booking' });
  }
};

// Decline booking
exports.declineBooking = async (req, res) => {
  const bookingId = req.params.id;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.status = 'Declined';
    await booking.save();

    res.status(200).json({ message: 'Booking declined' });
  } catch (error) {
    console.error('Error declining booking:', error);
    res.status(500).json({ message: 'Server error while declining booking' });
  }
};

exports.getBookingsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const filter = req.query.filter || 'All';
    const futureOnly =
      req.query.futureOnly === 'true' || req.query.futureOnly === '1';

    const query = { studentId };

    if (filter === 'Pending') {
      query.status = 'Pending';
    } else if (filter === 'Completed') {
      query.status = 'Accepted';
      query.attendanceStatus = 'Completed';
    } else if (filter === 'NotAttended') {
      query.status = 'Accepted';
      query.attendanceStatus = 'NotAttended';
    } else if (filter === 'All') {
      query.status = { $in: ['Pending', 'Accepted'] };
    }

    const bookings = await Booking.find(query)
      .populate('tutorId', 'name') // tutor name
      .populate('classId')         // class info incl. date/time/coords
      .sort({ createdAt: -1 })
      .lean();

    const toDT = (cls) => {
      if (!cls?.date) return null;
      const [y, m, d] = String(cls.date).split('-').map(Number);
      const [hh, mm] = String(cls.startTime || '00:00')
        .split(':')
        .map((n) => parseInt(n, 10) || 0);
      return new Date(y, (m || 1) - 1, d || 1, hh, mm);
    };

    let out = bookings.map((b) => ({
      _id: b._id,
      tutorId: b.tutorId,
      classId: b.classId,
      status: b.status,
      attendanceStatus: b.attendanceStatus || 'Upcoming',
      createdAt: b.createdAt,
      latitude: b.classId?.latitude ?? null,
      longitude: b.classId?.longitude ?? null,
    }));

    if (futureOnly) {
      const now = new Date();
      out = out
        .filter((b) => {
          const dt = toDT(b.classId);
          return dt && dt >= now; // only future classes
        })
        .sort((a, b) => toDT(a.classId) - toDT(b.classId)); // soonest first
    }

    return res.json(out);
  } catch (err) {
    console.error('Error fetching student bookings:', err);
    return res
      .status(500)
      .json({ message: 'Error fetching student bookings' });
  }
};

exports.markAttendanceStatus = async (req, res) => {
try {
    const bookingId = req.params.bookingId;
    const { status } = req.body; // should be 'Completed' or 'NotAttended'

    const validStatuses = ['Completed', 'NotAttended'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid attendance status' });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status !== 'Accepted') {
      return res.status(400).json({ message: 'Cannot update attendance for unaccepted booking' });
    }

    booking.attendanceStatus = status;
    await booking.save();

    res.json({ message: `Booking marked as ${status}` });
  } catch (err) {
    console.error('Error updating attendance:', err);
    res.status(500).json({ message: 'Error updating attendance' });
  }
};