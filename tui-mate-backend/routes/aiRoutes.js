const express = require('express');
const router = express.Router();
const { getAIMatchedTutors } = require('../controllers/aiController');

// Route to get AI matched tutors:
router.post('/ai-match/:id', getAIMatchedTutors);

module.exports = router;
