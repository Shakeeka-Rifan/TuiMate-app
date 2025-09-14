// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { adminLogin, approveTutor, getPendingTutors, getStudentsAdmin, getTutorsAdmin } = require('../controllers/adminController');



// Admin Login
router.post('/login', adminLogin);
router.get('/pending-tutors', getPendingTutors);
router.put('/approve-tutor/:id', approveTutor);
// List all students (Admin)
router.get('/students', getStudentsAdmin);
router.get('/Tutors', getTutorsAdmin);


module.exports = router;
