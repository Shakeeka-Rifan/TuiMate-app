require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); // ✅ Required to create server

const ChatMessage = require('./models/ChatMessage');

const app = express();
const server = http.createServer(app); // ✅ Create server from express
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// ✅ Socket.IO message logic
io.on('connection', (socket) => {
  console.log('🔗 New client connected');

  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message } = data;

    try {
      const newMsg = new ChatMessage({ senderId, receiverId, message });
      await newMsg.save();
      io.emit('receiveMessage', newMsg); // or use socket.to(room).emit()
    } catch (err) {
      console.error('❌ Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;

const forgotPasswordRoutes = require('./routes/forgotPasswordRoutes');
const authRoutes = require('./routes/authRoutes');

const adminRoutes = require('./routes/adminRoutes');

const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');
const tutorRoutes = require('./routes/tutorRoutes');
const aiRoutes = require('./routes/aiRoutes');
const studentInteractionRoutes = require('./routes/studentInteractionRoutes');
const bookingRoutes = require('./routes/bookings');
const reviewRoutes = require('./routes/reviewRoutes');
const utilsRoutes = require('./routes/utils');


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // to serve uploaded NIC images


app.use('/api/auth/forgot-password', forgotPasswordRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/classes', classRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/tutor', tutorRoutes);

app.use('/api/students', studentInteractionRoutes); // <<--- add this
app.use('/api/ai', aiRoutes);

app.use('/api/bookings', bookingRoutes);

app.use('/api/reviews', reviewRoutes);
app.use('/api/utils', utilsRoutes);



// PART 3: Link this router in your backend's index.js






const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);





mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    server.listen(PORT, () => console.log(`🚀 Server with Socket.IO running on port ${PORT}`));

  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

