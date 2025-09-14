// routes/tutorRoutes.js
const path = require('path');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadProfileImage, getTutorById, getTutorDetails, updateTutorProfile,changeTutorPassword } = require('../controllers/tutorController');

const storage = multer.diskStorage({
  destination: 'uploads/tutors/',
  filename: (req, file, cb) => {
    cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });
router.put('/:id', updateTutorProfile);
router.post('/upload/:id', upload.single('image'), uploadProfileImage);
router.get('/:id', getTutorById);
router.patch('/:id/password', changeTutorPassword); 
router.get('/:id/details', getTutorDetails);

module.exports = router;