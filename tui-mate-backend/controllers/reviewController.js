const Review = require('../models/Review');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');


exports.submitReview = async (req, res) => {
  try {
    const { tutorId, studentId, rating, comment, classId } = req.body;

    const newReview = new Review({
      tutor: tutorId,
      student: studentId,
      rating,
      comment,
      classId
    });

    await newReview.save();

    // ⭐ Recalculate rating:
    const allReviews = await Review.find({ tutor: tutorId });
    const totalReviews = allReviews.length;
    const sumRatings = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = sumRatings / totalReviews;

    await Tutor.findByIdAndUpdate(tutorId, {
      'rating.value': avgRating,
      'rating.count': totalReviews
    });

    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// ⭐ Create a review


// ⭐ Get reviews for a tutor
exports.getReviewsForTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;

    // ✅ must match the field name "tutor" in Review model
    const reviews = await Review.find({ tutor: tutorId })
      .populate('student', 'name email') // optional: show student info
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const avgRating =
      totalReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

    return res.status(200).json({
      avgRating: Number(avgRating.toFixed(1)),
      totalReviews,
      reviews,
    });
  } catch (error) {
    console.error("Error fetching tutor reviews:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// controllers/reviews/getReviews.js

// controllers/reviews/reviewController.js

// controllers/reviews/reviewController.js
exports.getReviewsForLoggedInTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;

    const reviews = await Review.find({ tutor: tutorId })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    res.status(200).json({ avgRating, totalReviews, reviews });
  } catch (error) {
    console.error('Error fetching tutor reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


