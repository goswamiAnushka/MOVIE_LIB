const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  playlistTitle: { type: String, required: true },
  description: { type: String, required: true },
  thumbnail: { type: String, required: true },
  isPrivate: { type: Boolean, default: false },
  movies: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    poster_path: { type: String},
    release_date: { type: String},
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Playlist', playlistSchema);