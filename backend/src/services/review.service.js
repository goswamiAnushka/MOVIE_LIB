const Review = require("../models/review.model");
const User = require("../models/user.model");

// Service for creating a review
exports.createReview = async (reviewData) => {
  try {
    const user = await User.findById(reviewData.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const review = new Review(reviewData);
    await review.save();
    return review;
  } catch (error) {
    throw new Error("Error creating review");
  }
};

// Service for getting all reviews for a specific movie by its movieId
exports.getReviewsByMovieId = async (movieId) => {
  try {
    console.log("Fetching Reviews for Movie:", movieId);
    const reviews = await Review.find({ movieId })
      .sort({ createdAt: -1 })
      .populate({ path: "userId", select: "username" });

    return reviews.map((review) => ({
      _id: review._id,
      movieId: review.movieId,
      userId: review.userId?._id.toString(), // Ensure it's a string
      review_title: review.review_title,
      review_details: review.review_details,
      generalScore: review.generalScore,
      plotScore: review.plotScore,
      storyScore: review.storyScore,
      characterScore: review.characterScore,
      cinematographyScore: review.cinematographyScore,
      rateScore: review.rateScore,
      createdAt: review.createdAt,
      username: review.userId?.username,
    }));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw new Error("Error fetching reviews");
  }
};

// Service for getting a single review by reviewId
exports.getReviewById = async (reviewId) => {
  try {
    const review = await Review.findById(reviewId).populate({
      path: "userId",
      select: "username",
    });

    if (!review) {
      throw new Error("Review not found");
    }

    return {
      _id: review._id,
      movieId: review.movieId,
      userId: review.userId?._id.toString(),
      review_title: review.review_title,
      review_details: review.review_details,
      generalScore: review.generalScore,
      plotScore: review.plotScore,
      storyScore: review.storyScore,
      characterScore: review.characterScore,
      cinematographyScore: review.cinematographyScore,
      rateScore: review.rateScore,
      createdAt: review.createdAt,
      username: review.userId?.username,
    };
  } catch (error) {
    console.error("Error fetching review:", error);
    throw new Error("Error fetching review");
  }
};

// Service for updating a review by reviewId
exports.updateReview = async (reviewId, updateData) => {
  try {
    const review = await Review.findByIdAndUpdate(reviewId, updateData, {
      new: true, // Return the updated review
    });

    if (!review) {
      throw new Error("Review not found");
    }

    return {
      _id: review._id,
      movieId: review.movieId,
      userId: review.userId?._id.toString(),
      review_title: review.review_title,
      review_details: review.review_details,
      generalScore: review.generalScore,
      plotScore: review.plotScore,
      storyScore: review.storyScore,
      characterScore: review.characterScore,
      cinematographyScore: review.cinematographyScore,
      rateScore: review.rateScore,
      createdAt: review.createdAt,
      username: review.userId?.username,
    };
  } catch (error) {
    console.error("Error updating review:", error);
    throw new Error("Error updating review");
  }
};
