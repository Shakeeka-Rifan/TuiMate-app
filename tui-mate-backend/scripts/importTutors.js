// backend/scripts/importTutors.js
const mongoose = require('mongoose');
const Tutor = require('../models/Tutor');
const dummyTutors = require('../data/dummyTutors');
require('dotenv').config();

async function importData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Tutor.deleteMany(); // Optional: clears previous data
    await Tutor.insertMany(dummyTutors);
    console.log("✅ Dummy tutor data inserted");
    process.exit();
  } catch (err) {
    console.error("❌ Error inserting dummy data", err);
    process.exit(1);
  }
}

importData();
