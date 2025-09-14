// config/studentMulter.js
const multer = require('multer');
const path = require('path');

// 📷 Student profile image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/students/'); // Save in uploads/students/
  },
  filename: function (req, file, cb) {
    cb(null, `profile_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const uploadStudentImage = multer({ storage });
module.exports = uploadStudentImage;
