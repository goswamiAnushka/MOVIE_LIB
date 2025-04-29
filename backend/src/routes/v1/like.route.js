const express = require("express");
const LikeController = require("../../controllers/like.controller");
const router = express.Router();
const auth = require("../../middlewares/auth"); 

// Like a movie
router.post("/like", auth(), LikeController.likeMovie);

// Unlike a movie
router.post("/unlike", auth(), LikeController.unlikeMovie);

// Get liked movies
router.get("/liked-movies", auth(), LikeController.getLikedMovies);

module.exports = router;
