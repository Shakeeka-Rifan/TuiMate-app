// scripts/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');

dotenv.config(); // Load env vars

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const email = 'admin@tuimate.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingAdmin = await Admin.findOne({ email });

  if (!existingAdmin) {
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();
    console.log('✅ Admin created successfully!');
  } else {
    console.log('⚠️ Admin already exists.');
  }

  mongoose.disconnect();
}).catch(err => {
  console.error('❌ Error connecting to DB', err);
});
