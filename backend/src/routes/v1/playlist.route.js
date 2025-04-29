const express = require("express");
const playlistController = require("../../controllers/playlist.controller");
const auth = require("../../middlewares/auth");
const router = express.Router();

router.post("/", auth(), playlistController.createPlaylist);
router.get("/", auth(), playlistController.getPlaylists);
router.get("/:id", auth(), playlistController.getPlaylistById);
router.put("/:id", auth(), playlistController.updatePlaylist);
router.delete("/:id", auth(), playlistController.deletePlaylist);

module.exports = router;