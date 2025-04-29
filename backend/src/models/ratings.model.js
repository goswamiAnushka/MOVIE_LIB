const mongoose = require('mongoose');
const ratingSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      movieId: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 10 },
      review: { type: String },
      postedToFeed: { type: Boolean, default: false },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model('Rating', ratingSchema);
  