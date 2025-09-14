const mongoose = require('mongoose');

const tutorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  nic: String,
  qualification: String,
  subjects: [String], // subject expertise
  password: String,
  nicImage: String,
  approved: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },

  location: String, // e.g., "Colombo"
gender: {
  type: String,
  enum: ['Male', 'Female', 'Other'],
  required: true,
},



  fee:{ type: Number, required:false},

  profileImage: String, // optional
  rating: {
    value: { type: Number, default: 4 },
    count: { type: Number, default: 0 },
  },

  availability: [String], // ⭐ NEW field → e.g. ['Morning', 'Afternoon', 'Evening', 'Night']

  grades: [String], // ⭐ NEW optional field → e.g. ['1', '2', '3'] → grades this tutor teaches

});

module.exports = mongoose.model('Tutor', tutorSchema);
