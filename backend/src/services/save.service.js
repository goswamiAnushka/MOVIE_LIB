const Save = require("../models/save.model");

// services/SaveMovieService.js
const SaveMovie = require("../models/SaveMovie");

class SaveMovieService {
  static async saveMovie(userId, movieId) {
    const savedMovie = new SaveMovie({ userId, movieId });
    return await savedMovie.save();
  }

  static async unsaveMovie(userId, movieId) {
    return await SaveMovie.findOneAndDelete({ userId, movieId });
  }

  static async getSavedMovies(userId) {
    return await SaveMovie.find({ userId });
  }
}

module.exports = SaveMovieService;