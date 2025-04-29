const playlistService = require("../services/playlist.service");

const createPlaylist = async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the incoming request body
    const playlist = await playlistService.createPlaylist(req.user.id, req.body);
    console.log("Playlist created:", playlist); // Log the created playlist
    res.status(201).json(playlist);
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).json({ message: "Error creating playlist", error: error.message });
  }
};

const getPlaylists = async (req, res) => {
  try {
    const playlists = await playlistService.getPlaylists(req.user.id);
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving playlists", error: error.message });
  }
};

const getPlaylistById = async (req, res) => {
  try {
    const playlist = await playlistService.getPlaylistById(req.params.id, req.user.id);
    if (!playlist) return res.status(404).json({ message: "Playlist not found" });
    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving playlist", error: error.message });
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const updatedPlaylist = await playlistService.updatePlaylist(req.params.id, req.user.id, req.body);
    if (!updatedPlaylist) return res.status(404).json({ message: "Playlist not found" });
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    res.status(500).json({ message: "Error updating playlist", error: error.message });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const deletedPlaylist = await playlistService.deletePlaylist(req.params.id, req.user.id);
    if (!deletedPlaylist) return res.status(404).json({ message: "Playlist not found" });
    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting playlist", error: error.message });
  }
};

module.exports = {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
};