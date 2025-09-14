const ChatMessage  = require('../models/ChatMessage');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');

exports.getStudentTutors = async (req, res) => {
  const studentId = req.params.id;

  try {
    const messages = await ChatMessage.find({
      $or: [
        { senderId: studentId },
        { receiverId: studentId }
      ]
    }).sort({ createdAt: -1 });

    const tutorData = {};

    for (let msg of messages) {
      const otherUserId = msg.senderId === studentId ? msg.receiverId : msg.senderId;
      if (!tutorData[otherUserId]) {
        tutorData[otherUserId] = {
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
        };
      }
    }

    const tutorIds = Object.keys(tutorData);
    const tutors = await Tutor.find({ _id: { $in: tutorIds } });

    const enrichedTutors = tutors.map(tutor => ({
      _id: tutor._id,
      name: tutor.name,
      profileImage: tutor.profileImage,
      lastMessage: tutorData[tutor._id]?.lastMessage || '',
      lastMessageTime: tutorData[tutor._id]?.lastMessageTime || '',
    }));

    res.status(200).json(enrichedTutors);
  } catch (err) {
    console.error('Error fetching tutors for student:', err);
    res.status(500).json({ message: 'Server error fetching tutors' });
  }
};



exports.getMessagesBetweenUsers = async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    const messages = await ChatMessage.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
};



exports.getChatListForUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const messages = await ChatMessage.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    });

    const users = new Set();
    messages.forEach(m => {
      users.add(m.senderId === userId ? m.receiverId : m.senderId);
    });

    const userList = await Promise.all(Array.from(users).map(async (id) => {
      const student = await Student.findById(id).lean();
      const tutor = await Tutor.findById(id).lean();
      return student || tutor;
    }));

    res.json(userList.filter(Boolean));
  } catch (err) {
    res.status(500).json({ error: 'Error fetching inbox' });
  }
};

exports.markMessagesAsRead = async (req, res) => {
  const { senderId, receiverId } = req.params;
  try {
    await ChatMessage.updateMany(
      { senderId, receiverId, read: false },
      { $set: { read: true } }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update messages' });
  }
};

exports.getTutorStudents = async (req, res) => {
  const tutorId = req.params.id;

  try {
    // get recent messages involving this tutor, newest first
    const messages = await ChatMessage.find({
      $or: [{ senderId: tutorId }, { receiverId: tutorId }]
    }).sort({ createdAt: -1 });

    // map studentId -> { lastMessage, lastMessageTime }
    const studentData = {};
    for (const msg of messages) {
      const otherUserId = msg.senderId == tutorId ? msg.receiverId : msg.senderId;
      // only attach once (the newest message already because of sorting)
      if (!studentData[otherUserId]) {
        studentData[otherUserId] = {
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
        };
      }
    }

    const studentIds = Object.keys(studentData);
    const students = await Student.find({ _id: { $in: studentIds } }, 'name profileImage');

    const enriched = students.map((s) => ({
      _id: s._id,
      name: s.name,
      profileImage: s.profileImage,
      lastMessage: studentData[s._id]?.lastMessage || '',
      lastMessageTime: studentData[s._id]?.lastMessageTime || '',
    }));

    res.status(200).json(enriched);
  } catch (err) {
    console.error('Error fetching students for tutor:', err);
    res.status(500).json({ message: 'Server error fetching students' });
  }
};


exports.sendMessage = async (req, res) => {
  const { senderId, receiverId, message } = req.body;
  try {
    const msg = new ChatMessage({ senderId, receiverId, message });
    await msg.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json({ error: 'Error sending message' });
  }
};



