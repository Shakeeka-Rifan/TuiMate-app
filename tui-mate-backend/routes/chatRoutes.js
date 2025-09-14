const express = require('express');
const router = express.Router();
const { getStudentTutors,  getMessagesBetweenUsers,
  sendMessage,
  getChatListForUser,
  markMessagesAsRead, getTutorStudents } = require('../controllers/chatController');

router.get('/student/:id/tutors', getStudentTutors);
router.get('/:senderId/:receiverId', getMessagesBetweenUsers);
router.post('/send', sendMessage); // ✅ Add this

router.get('/inbox/:userId', getChatListForUser);
router.patch('/read/:senderId/:receiverId', markMessagesAsRead);
router.get('/tutor/:id/students', getTutorStudents); // ✅ Add this

module.exports = router;
