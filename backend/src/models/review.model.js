const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    movieId: { type: String, required: true },
    review_title: { type: String, required: true },
    review_details: { type: String, required: true },
    tags: { type: [String], default: [] },
    generalScore: { type: Number, min: 0, max: 10, required: true },
    plotScore: { type: Number, min: 0, max: 10, required: true },
    storyScore: { type: Number, min: 0, max: 10, required: true },
    characterScore: { type: Number, min: 0, max: 10, required: true },
    cinematographyScore: { type: Number, min: 0, max: 10, required: true },
    rateScore: { type: Number, min: 0, max: 10, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
