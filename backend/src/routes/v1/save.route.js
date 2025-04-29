const express = require("express");
const router = express.Router();
const SaveMovieController = require("../../controllers/save.controller");


router.post("/save", SaveMovieController.saveMovie);

router.delete("/unsave", SaveMovieController.unsaveMovie);


router.get("/saved-movies/:userId", SaveMovieController.getSavedMovies);

module.exports = router;

