const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'Tutor', required: true },
  subject: String,
  date: String, // You can use Date type if needed
  startTime: String,
 endTime: { type: String, default: '' },
 fee: Number,
  batchSize: Number,
  grade: String,
  status: { type: String, enum: ['Upcoming', 'Completed', 'Cancelled'], default: 'Upcoming' },

  classType: String,
// models/Class.js
latitude:  { type: Number, required: true, min: -90,  max: 90  },
longitude: { type: Number, required: true, min: -180, max: 180 },
location:  { type: String, required: true },

}, { timestamps: true });

module.exports = mongoose.model('Class', classSchema);
