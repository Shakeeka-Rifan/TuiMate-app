const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');


router.get('/tutor/:tutorId', reviewController.getReviewsForTutor);
router.post('/submit', reviewController.submitReview); // ⭐ ADD THIS

router.get("/tutor/:tutorId", reviewController.getReviewsForLoggedInTutor);

module.exports = router;
