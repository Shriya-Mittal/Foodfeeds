const express = require("express");
const router = express.Router();
const { authUserMiddleware } = require("../middlewares/auth.middleware");
const reviewController = require("../controllers/review.controller");

router.post("/", authUserMiddleware, reviewController.createReview);
router.get("/:foodId", authUserMiddleware, reviewController.getReviewsByFood);

module.exports = router;
