const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const reviewService = require("../services/review.service");
const Review = require("../models/review.model"); // Ensure correct path
const ApiError = require("../utils/ApiError");

// Controller for creating a review (Protected)
const createReview = catchAsync(async (req, res) => {
  try {
    const { movieId, review_title, review_details, tags = [], generalScore, plotScore, storyScore, characterScore, cinematographyScore, rateScore } = req.body;

    // Ensure user is authenticated
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    if (!movieId || !review_title || !review_details) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Missing required fields" });
    }

    const reviewData = {
      userId: req.user._id, 
      movieId,
      review_title,
      review_details,
      tags,
      generalScore,
      plotScore,
      storyScore,
      characterScore,
      cinematographyScore,
      rateScore,
    };

    const review = await reviewService.createReview(reviewData);
    return res.status(httpStatus.CREATED).json(review);
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: error.message || "Error creating review" });
  }
});

// Controller for getting reviews by movie ID (Public)
const getReviewsByMovieId = catchAsync(async (req, res) => {
  const { movieId } = req.params;

  if (!movieId) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Movie ID is required" });
  }

  const reviews = await reviewService.getReviewsByMovieId(movieId);

  if (!reviews || reviews.length === 0) {
    return res.status(httpStatus.NOT_FOUND).json({ message: "No reviews found for this movie" });
  }

  res.status(httpStatus.OK).json({ reviews });
});

// Controller for getting a single review by ID (Public)
const getReviewById = catchAsync(async (req, res) => {
  const { reviewId } = req.params;

  const review = await reviewService.getReviewById(reviewId);

  if (!review) {
    return res.status(httpStatus.NOT_FOUND).json({ message: "Review not found" });
  }

  res.status(httpStatus.OK).json(review);
});

// Controller for updating a review (Protected, Only Owner Can Edit)
const updateReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const { review_title, review_details, tags, generalScore, plotScore, storyScore, characterScore, cinematographyScore, rateScore } = req.body;

  // Ensure user is authenticated
  if (!req.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required");
  }

  // Fetch the review to check ownership
  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(httpStatus.NOT_FOUND).json({ message: "Review not found" });
  }

  // Ensure only the review owner can update
  if (String(review.userId) !== String(req.user._id)) {
    throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized to edit this review");
  }

  const updatedReview = await reviewService.updateReview(reviewId, {
    review_title,
    review_details,
    tags,
    generalScore,
    plotScore,
    storyScore,
    characterScore,
    cinematographyScore,
    rateScore,
  });

  res.status(httpStatus.OK).json({ message: "Review updated successfully", review: updatedReview });
});

// Controller for deleting a review (Protected, Only Owner Can Delete)
const deleteReview = catchAsync(async (req, res) => {
  try {
    const { reviewId } = req.params;

    // Ensure user is authenticated
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Authentication required");
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Review not found" });
    }

    // Ensure only the review owner can delete
    if (String(review.userId) !== String(req.user._id)) {
      throw new ApiError(httpStatus.FORBIDDEN, "You are not authorized to delete this review");
    }

    await review.deleteOne();
    res.status(httpStatus.OK).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Server error. Unable to delete review." });
  }
});

module.exports = { createReview, getReviewsByMovieId, getReviewById, updateReview, deleteReview };
