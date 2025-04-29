import React, { useState, useEffect } from "react";
import axios from "axios";
import axiosCustom from "../../Services/AxiosConfig/axiosCustom";
import Navbar from "../Navbar/Navbar";
import Sidebar from '../Sidebar/Sidebar';
import {
  Button,
  TextField,
  Switch,
  IconButton,
  Typography,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete, Add, Close } from "@mui/icons-material"; // Updated icon import
import "./Playlist.css";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

const PlaylistPage = ({ playlistId }) => {
  const [playlistTitle, setPlaylistTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [addedMovies, setAddedMovies] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [playlistSaved, setPlaylistSaved] = useState(false);
  const [savedPlaylist, setSavedPlaylist] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(15);
  const [sortBy, setSortBy] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("info");

  useEffect(() => {
    if (playlistId) {
      const fetchPlaylist = async () => {
        try {
          const response = await axiosCustom.get(`/playlist/${playlistId}`);
          const playlist = response.data;
          setPlaylistTitle(playlist.playlistTitle);
          setDescription(playlist.description);
          setThumbnail(playlist.thumbnail);
          setIsPrivate(playlist.isPrivate);
          setAddedMovies(playlist.movies);
          setIsEditing(true);
          setSavedPlaylist(playlist);
        } catch (error) {
          console.error("Error fetching playlist:", error);
          showDialog("Error fetching playlist. Please try again.", "error");
        }
      };
      fetchPlaylist();
    }
  }, [playlistId]);

  useEffect(() => {
    if (searchQuery) {
      setPage(1);
      setSearchResults([]);
      fetchMovies(1);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchMovies = async (pageNumber) => {
    try {
      const response = await apiClient.get(`/search/movie`, {
        params: { query: searchQuery, page: pageNumber },
      });
      const newResults = response.data.results;
      if (newResults.length === 0) {
        setHasMore(false);
      } else {
        setSearchResults((prevResults) => [...prevResults, ...newResults]);
      }
    } catch (error) {
      console.error("Error fetching movies from TMDB:", error);
      showDialog("Error fetching movies. Please try again.", "error");
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollHeight - (scrollTop + clientHeight) < 100 && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      fetchMovies(page);
    }
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setThumbnail(response.data.secure_url);
    } catch (error) {
      console.error("Error uploading image:", error);
      showDialog("Error uploading image. Please try again.", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleAddMovie = (movie) => {
    if (!addedMovies.some((m) => m.id === movie.id)) {
      setAddedMovies([...addedMovies, movie]);
    }
  };

  const handleRemoveMovie = (movieId) => {
    setAddedMovies(addedMovies.filter((movie) => movie.id !== movieId));
    showDialog("Movie removed from playlist!", "success");
  };

  const handleSavePlaylist = async () => {
    try {
      const playlistData = {
        playlistTitle,
        description,
        thumbnail,
        isPrivate,
        movies: addedMovies,
      };

      let response;
      if (isEditing && savedPlaylist?._id) {
        response = await axiosCustom.put(`/playlist/${savedPlaylist._id}`, playlistData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        response = await axiosCustom.post("/playlist", playlistData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      setSavedPlaylist(response.data);
      setPlaylistSaved(true);
      setIsEditing(true);
      showDialog("Playlist saved successfully!", "success");
    } catch (error) {
      console.error("Error saving playlist:", error.response ? error.response.data : error.message);
      showDialog("Failed to save playlist. Please try again.", "error");
    }
  };

  const handleEditPlaylist = () => {
    setPlaylistSaved(false);
    setIsEditing(true);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleDeletePlaylist = async () => {
    try {
      await axiosCustom.delete(`/playlist/${savedPlaylist._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Reset form to initial state
      setPlaylistTitle("");
      setDescription("");
      setThumbnail("");
      setIsPrivate(false);
      setAddedMovies([]);
      setSavedPlaylist(null);
      setPlaylistSaved(false);
      setIsEditing(false);
      setSearchQuery("");
      setSearchResults([]);
      showDialog("Playlist deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting playlist:", error.response ? error.response.data : error.message);
      showDialog("Failed to delete playlist. Please try again.", "error");
    }
  };

  // Pagination logic
  const indexOfLastMovie = currentPage * moviesPerPage;
  const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
  const currentMovies = searchResults.slice(indexOfFirstMovie, indexOfLastMovie);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Sorting logic for search results
  const handleSortChange = (event) => {
    const sortValue = event.target.value;
    setSortBy(sortValue);

    let sortedMovies = [...searchResults];
    switch (sortValue) {
      case "popularity":
        sortedMovies.sort((a, b) => b.popularity - a.popularity);
        break;
      case "releaseYear":
        sortedMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
        break;
      case "title":
        sortedMovies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }
    setSearchResults(sortedMovies);
  };

  // Show MUI Dialog
  const showDialog = (message, type) => {
    setDialogMessage(message);
    setDialogType(type);
    setOpenDialog(true);
  };

  // Close MUI Dialog
  const closeDialog = () => {
    setOpenDialog(false);
  };

  return (
    <div className="playlist-page">
      <Navbar />
      <div className="playlist-layout">
        <Sidebar />
        <div className="create-playlist-container">
          <Container className="create-playlist-content">
            {playlistSaved ? (
              <>
                <Typography variant="h4" gutterBottom>
                  Saved Playlist
                </Typography>
                <div className="saved-playlist">
                  <Card>
                    <CardMedia
                      component="img"
                      height="150"
                      image={savedPlaylist.thumbnail}
                      alt={savedPlaylist.playlistTitle}
                      className="thumbnail-banner"
                    />
                    <CardContent>
                      <Typography variant="h5">{savedPlaylist.playlistTitle}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {savedPlaylist.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <IconButton onClick={handleEditPlaylist}>
                        <Edit />
                      </IconButton>
                      <IconButton onClick={handleDeletePlaylist}>
                        <Delete />
                      </IconButton>
                    </CardActions>
                  </Card>

                  {/* Filter Component */}
                  <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
                    <FormControl sx={{ minWidth: 150 }}>
                      <InputLabel>Sort By</InputLabel>
                      <Select value={sortBy} onChange={handleSortChange} label="Sort By">
                        <MenuItem value="popularity">Popularity</MenuItem>
                        <MenuItem value="releaseYear">Release Year</MenuItem>
                        <MenuItem value="title">Title</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Display Added Movies as Small Thumbnails */}
                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Movies in Playlist
                  </Typography>
                  <div className="added-movies">
                    {addedMovies.map((movie) => (
                      <div key={movie.id} className="movie-thumbnail">
                        <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />
                        <IconButton
                          className="remove-icon"
                          onClick={() => handleRemoveMovie(movie.id)}
                          size="small"
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "5px",
                            backgroundColor: "rgba(255, 0, 0, 0.8)",
                            color: "white",
                            zIndex: 100,
                          }}
                        >
                          <Close /> {/* Updated icon */}
                        </IconButton>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                <Typography variant="h4" gutterBottom>
                  Create Playlist
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    {/* Thumbnail Upload Area */}
                    <div className="thumbnail-upload">
                      <input type="file" accept="image/*" onChange={handleUpload} id="thumbnail-upload" hidden />
                      <label htmlFor="thumbnail-upload" className="thumbnail-area">
                        {thumbnail ? (
                          <div className="thumbnail-container">
                            <img src={thumbnail} alt="Thumbnail" className="thumbnail-preview" />
                          </div>
                        ) : (
                          <Typography>Upload Thumbnail</Typography>
                        )}
                      </label>
                    </div>

                    <TextField fullWidth label="Playlist Title" value={playlistTitle} onChange={(e) => setPlaylistTitle(e.target.value)} sx={{ mb: 2 }} />
                    <TextField fullWidth label="Description" multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)} sx={{ mb: 2 }} />

                    {/* Private Toggle in Right Corner */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                      <Typography variant="body1" sx={{ mr: 2 }}>
                        Private Playlist
                      </Typography>
                      <Switch checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)} color="secondary" />
                    </Box>
                  </Grid>

                  {/* Movie Search */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Add Movies
                    </Typography>
                    <TextField fullWidth label="Search for movies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} sx={{ mb: 2 }} />
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                      <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortBy} onChange={handleSortChange} label="Sort By">
                          <MenuItem value="popularity">Popularity</MenuItem>
                          <MenuItem value="releaseYear">Release Year</MenuItem>
                          <MenuItem value="title">Title</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <div className="movie-results">
                      {currentMovies.map((movie) => (
                        <div key={movie.id} className="movie-thumbnail" onClick={() => handleAddMovie(movie)}>
                          <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />
                        </div>
                      ))}
                    </div>
                    <Pagination count={Math.ceil(searchResults.length / moviesPerPage)} page={currentPage} onChange={handlePageChange} />
                  </Grid>

                  {/* Added Movies */}
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      Added Movies
                    </Typography>
                    <div className="added-movies">
                      {addedMovies.map((movie) => (
                        <div key={movie.id} className="movie-thumbnail">
                          <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />
                          <IconButton
                            className="remove-icon"
                            onClick={() => handleRemoveMovie(movie.id)}
                            size="small"
                            style={{
                              position: "absolute",
                              top: "5px",
                              right: "5px",
                              backgroundColor: "WHITE",
                              color: "white",
                              zIndex: 100,
                            }}
                          >
                            <Close /> {/* Updated icon */}
                          </IconButton>
                        </div>
                      ))}
                    </div>
                  </Grid>
                </Grid>
                <Button variant="contained" color="secondary" onClick={handleSavePlaylist} sx={{ mt: 4 }}>
                  Save Playlist
                </Button>
              </>
            )}
          </Container>
        </div>
      </div>
      {/* MUI Dialog for Messages */}
      <Dialog open={openDialog} onClose={closeDialog}>
        <DialogTitle>{dialogType === "error" ? "Error" : "Success"}</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlaylistPage;