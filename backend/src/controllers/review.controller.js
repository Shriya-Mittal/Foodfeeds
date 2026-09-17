const reviewModel = require("../models/review.model");

async function createReview(req, res) {
  try {
    const { food, rating, text } = req.body;

    if (!food || !rating) {
      return res.status(400).json({ message: "food id aur rating zaroori hain" });
    }

    const review = await reviewModel.create({
      user: req.user._id,
      food,
      rating,
      text,
    });

    const populatedReview = await review.populate("user", "fullName");

    res.status(201).json({
      message: "Review add ho gaya",
      review: populatedReview,
    });
  } catch (err) {
    res.status(500).json({ message: "Review add karne mein error", error: err.message });
  }
}

async function getReviewsByFood(req, res) {
  try {
    const { foodId } = req.params;

    const reviews = await reviewModel
      .find({ food: foodId })
      .populate("user", "fullName")
      .sort({ createdAt: -1 });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    res.status(200).json({
      reviews,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: reviews.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Reviews fetch karne mein error", error: err.message });
  }
}

module.exports = {
  createReview,
  getReviewsByFood,
};
