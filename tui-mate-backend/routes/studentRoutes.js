// routes/studentRoutes.js
const express = require('express');
const path = require('path'); // 🔧 REQUIRED for path.extname

const multer = require('multer');
const router = express.Router();
const { savePreferences, getRecommendedTutors, searchTutors } = require('../controllers/studentController');
const Student = require('../models/Student');




// Setup multer
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `student-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// ✅ POST: Upload student profile image
router.post('/upload/:id', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('⚠️ No file uploaded');
      return res.status(400).json({ message: 'No image file uploaded' });
    }

    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.profileImage = req.file.path;
    await student.save();

    res.json({ message: 'Image uploaded', imageUrl: req.file.path });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// 🔧 Get a specific student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.json(student); // ✅ send JSON
  } catch (err) {
    console.error('Error fetching student by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// routes/studentRoutes.js  (add near the other routes)
router.get('/credits/:id', async (req, res) => {
  try {
    const s = await Student.findById(req.params.id).select('isPro aiCredits');
    if (!s) return res.status(404).json({ message: 'Student not found' });

    // initialize if missing (old docs)
    if (s.aiCredits == null) s.aiCredits = 3;
    await s.save();

    res.json({ isPro: s.isPro, aiCredits: s.aiCredits });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
});




router.put('/preferences/:id', savePreferences);
router.get('/recommended/:id', getRecommendedTutors); 
router.get('/search/tutors', searchTutors);    

module.exports = router;
