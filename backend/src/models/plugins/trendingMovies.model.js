const mongoose = require('mongoose');

const trendingMovieSchema = new mongoose.Schema(
  {
    movieId: { type: String, required: true },
    title: { type: String, required: true },
    poster: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TrendingMovie', trendingMovieSchema);
