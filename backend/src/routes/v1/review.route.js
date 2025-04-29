// Import required modules
const express = require("express");
const reviewController = require("../../controllers/review.controller");
const auth = require("../../middlewares/auth"); 

const router = express.Router();


router.post("/create", auth(), reviewController.createReview);

router.get("/movie/:movieId", reviewController.getReviewsByMovieId);

router.get("/:reviewId", reviewController.getReviewById);

router.put("/:reviewId", auth(), reviewController.updateReview);

router.delete("/:reviewId", auth(), reviewController.deleteReview);

module.exports = router;
