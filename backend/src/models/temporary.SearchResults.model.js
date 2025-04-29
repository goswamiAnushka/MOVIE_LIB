const mongoose = require('mongoose');

const searchResultSchema = new mongoose.Schema(
  {
    query: { type: String, required: true },
    movies: { type: Array, default: [] },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

searchResultSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('TemporarySearchResult', searchResultSchema);
