const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
   name: { type: String }, // ⭐ ADD THIS
  role: {
    type: String,
    default: 'Student',
    enum: ['Student'],
  },
  email: { type: String, required: true, unique: true },
  grade: { type: String },
  password: { type: String, required: true },

  // 🎯 New fields for smart AI quiz data
 preferences: {
    subjects: [String],
      studyTime: [String],
    classType: String,
    genderPreference: String,
  },
    profileImage: { type: String }, // ✅ Add this,
  quizCompleted: {
    type: Boolean,
    default: false,
  },

  
  // ⭐ Add these two
  // ⭐ defaults for new students
  isPro: { type: Boolean, default: false },
  aiCredits: { type: Number, default: 3 },
}, { timestamps: true });

// In models/Student.js, after schema definition
studentSchema.pre('save', function(next) {
  if (this.isPro == null) this.isPro = false;
  if (this.aiCredits == null) this.aiCredits = 3;
  next();
});


module.exports = mongoose.model('Student', studentSchema);