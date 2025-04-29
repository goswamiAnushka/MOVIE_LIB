const Playlist = require("../models/playlist.model");

// Create a new playlist
const createPlaylist = async (userId, playlistData) => {
  try {
    const newPlaylist = new Playlist({
      userId,
      ...playlistData,
    });
    await newPlaylist.save();
    return newPlaylist;
  } catch (error) {
    throw new Error("Error creating playlist: " + error.message);
  }
};

// Get all playlists for a user
const getPlaylists = async (userId) => {
  try {
    const playlists = await Playlist.find({ userId }).sort({ createdAt: -1 });
    return playlists;
  } catch (error) {
    throw new Error("Error retrieving playlists: " + error.message);
  }
};

// Get a playlist by ID (for a specific user)
const getPlaylistById = async (playlistId, userId) => {
  try {
    const playlist = await Playlist.findOne({ _id: playlistId,userId });
    if (!playlist) {
      throw new Error("Playlist not found");
    }
    return playlist;
  } catch (error) {
    throw new Error("Error retrieving playlist: " + error.message);
  }
};

// Update a playlist by ID
const updatePlaylist = async (playlistId, userId, updateData) => {
  try {
    const playlist = await Playlist.findOneAndUpdate(
      { _id: playlistId, userId },
      updateData,
      { new: true } // Return the updated document
    );
    if (!playlist) {
      throw new Error("Playlist not found");
    }
    return playlist;
  } catch (error) {
    throw new Error("Error updating playlist: " + error.message);
  }
};
// Delete a playlist by ID
const deletePlaylist = async (playlistId, userId) => {
  try {
    const playlist = await Playlist.findOneAndDelete({ _id: playlistId, userId });
    if (!playlist) {
      throw new Error("Playlist not found");
    }
    return playlist;
  } catch (error) {
    throw new Error("Error deleting playlist: " + error.message);
  }
};

module.exports = {
  createPlaylist,
  getPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
};
