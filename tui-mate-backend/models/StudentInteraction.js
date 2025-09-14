const mongoose = require('mongoose');

const studentInteractionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  searches: [{ type: String }],
  filterUsage: [{
    location: String,
    classType: String,
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('StudentInteraction', studentInteractionSchema);
