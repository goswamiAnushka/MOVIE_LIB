const SaveMovie = require("../models/save.model");

const saveMovie = async (req, res) => {
  try {
    const { movieId, userId } = req.body;

    // Validate request body
    if (!movieId || !userId) {
      return res.status(400).json({ success: false, message: "movieId and userId are required." });
    }

    // Check if the movie is already saved
    const existingSave = await SaveMovie.findOne({ userId, movieId });
    if (existingSave) {
      return res.status(400).json({ success: false, message: "Movie already saved." });
    }

    // Save the movie
    const savedMovie = new SaveMovie({ userId, movieId });
    await savedMovie.save();

    res.status(200).json({ success: true, message: "Movie saved successfully." });
  } catch (error) {
    console.error("Error saving movie:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};


const unsaveMovie = async (req, res) => {
    const { movieId, userId } = req.body;
  
    try {
      // Find and delete the saved movie
      const deletedSavedMovie = await SavedMovie.findOneAndDelete({ movieId, userId });
      if (!deletedSavedMovie) {
        return res.status(404).json({ message: "Movie not found in saved list." });
      }
  
      res.status(200).json({ message: "Movie unsaved successfully!" });
    } catch (error) {
      console.error("Error unsaving movie:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  
  const getSavedMovies = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const savedMovies = await SavedMovie.find({ userId });
      res.status(200).json(savedMovies);
    } catch (error) {
      console.error("Error fetching saved movies:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  
  module.exports = {
    saveMovie,
    unsaveMovie,
    getSavedMovies,
  };