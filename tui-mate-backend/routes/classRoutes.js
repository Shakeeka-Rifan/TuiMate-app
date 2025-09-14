const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const Class = require('../models/Class');


// existing
router.post('/create', classController.createClass);

router.get('/class/:classId', classController.getClassById);


// new:
router.get('/tutor/:tutorId', classController.getClassesForTutor);

// OPTIONAL: if not already done → PATCH to update status
router.patch('/:classId/complete', async (req, res) => {
  try {
    const classData = await Class.findById(req.params.classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // ❌ Prevent re-marking if already Completed or Cancelled
    if (classData.status === 'Completed') {
      return res.status(400).json({ message: 'Class is already marked as Completed' });
    }
    if (classData.status === 'Cancelled') {
      return res.status(400).json({ message: 'Class is Cancelled and cannot be marked as Completed' });
    }

    classData.status = 'Completed';
    await classData.save();

    res.json({ message: 'Class marked as completed' });
  } catch (err) {
    console.error('Error marking completed:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.patch('/:classId/cancel', async (req, res) => {
  try {
    const classData = await Class.findById(req.params.classId);
    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // ❌ Prevent re-marking if already Cancelled or Completed
    if (classData.status === 'Cancelled') {
      return res.status(400).json({ message: 'Class is already Cancelled' });
    }
    if (classData.status === 'Completed') {
      return res.status(400).json({ message: 'Class is Completed and cannot be cancelled' });
    }

    classData.status = 'Cancelled';
    await classData.save();

    res.json({ message: 'Class cancelled' });
  } catch (err) {
    console.error('Error cancelling class:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




module.exports = router;
