const Like = require("../models/like.model");

const LikeController = {
  // Get liked movies for the user
  async getLikedMovies(req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userId = req.user.id;
    try {
      const likedMovies = await Like.find({ userId });
      res.status(200).json(likedMovies);
    } catch (error) {
      console.error("Error fetching liked movies:", error);
      res.status(500).json({ message: "Error fetching liked movies", error });
    }
  },

  // Like a movie
  async likeMovie(req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { movieId } = req.body;
    const userId = req.user.id;

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    try {
      const existingLike = await Like.findOne({ userId, movieId });
      if (existingLike) {
        return res.status(400).json({ message: "Movie already liked" });
      }
      const like = new Like({ userId, movieId });
      await like.save();
      res.status(200).json({ message: "Movie liked successfully" });
    } catch (error) {
      console.error("Error liking movie:", error);
      res.status(500).json({ message: "Error liking movie", error });
    }
  },

  // Unlike a movie
  async unlikeMovie(req, res) {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { movieId } = req.body;
    const userId = req.user.id;

    if (!movieId) {
      return res.status(400).json({ message: "Movie ID is required" });
    }

    try {
      const like = await Like.findOneAndDelete({ userId, movieId });
      if (!like) {
        return res.status(404).json({ message: "Like not found" });
      }
      res.status(200).json({ message: "Movie unliked successfully" });
    } catch (error) {
      console.error("Error unliking movie:", error);
      res.status(500).json({ message: "Error unliking movie", error });
    }
  },
};

module.exports = LikeController;