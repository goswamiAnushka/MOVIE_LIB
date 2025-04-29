import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosCustom from "../../Services/AxiosConfig/axiosCustom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  CardActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { Edit, Delete, Save, Close } from "@mui/icons-material";
import Navbar from "../Navbar/Navbar";
import "./playlistDetails.css";
import { AddAPhoto } from "@mui/icons-material";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

const PlaylistDetails = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    playlistTitle: "",
    description: "",
    thumbnail: "",
    movies: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [yearFilter, setYearFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [genreFilter, setGenreFilter] = useState("all");
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const response = await axiosCustom.get(`/playlist/${playlistId}`);
        setPlaylist(response.data);
        setEditData({
          playlistTitle: response.data.playlistTitle,
          description: response.data.description,
          thumbnail: response.data.thumbnail,
          movies: response.data.movies,
        });
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [playlistId]);

  useEffect(() => {
    if (searchQuery) {
      const fetchMovies = async () => {
        try {
          const response = await apiClient.get(`/search/movie`, {
            params: { query: searchQuery },
          });
          setSearchResults(response.data.results);
        } catch (error) {
          console.error("Error fetching movies from TMDB:", error);
        }
      };
      fetchMovies();
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const response = await axiosCustom.put(`/playlist/${playlistId}`, editData);
      setPlaylist(response.data);
      setIsEditing(false);
      alert("Playlist updated successfully!");
    } catch (error) {
      console.error("Error updating playlist:", error);
      alert("Failed to update playlist. Please try again.");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosCustom.delete(`/playlist/${playlistId}`);
      alert("Playlist deleted successfully!");
      navigate("/playlists");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      alert("Failed to delete playlist. Please try again.");
    }
  };

  const handleAddMovie = (movie) => {
    if (!editData.movies.some((m) => m.id === movie.id)) {
      setEditData((prev) => ({
        ...prev,
        movies: [...prev.movies, movie],
      }));
    }
  };

  const handleRemoveMovie = (movieId) => {
    setEditData((prev) => ({
      ...prev,
      movies: prev.movies.filter((movie) => movie.id !== movieId),
    }));
  };

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setEditData((prev) => ({
        ...prev,
        thumbnail: response.data.secure_url,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleYearFilterChange = (event) => {
    setYearFilter(event.target.value);
  };

  const handleRatingFilterChange = (event) => {
    setRatingFilter(event.target.value);
  };

  const handleGenreFilterChange = (event) => {
    setGenreFilter(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const filteredMovies = editData.movies.filter((movie) => {
    if (yearFilter !== "all" && !movie.release_date.includes(yearFilter)) return false;
    if (ratingFilter !== "all" && movie.vote_average < parseFloat(ratingFilter)) return false;
    if (genreFilter !== "all" && !movie.genre_ids.includes(parseInt(genreFilter))) return false;
    return true;
  });

  const sortedMovies = filteredMovies.sort((a, b) => {
    if (sortOption === "title") {
      return a.title.localeCompare(b.title);
    } else if (sortOption === "release_date") {
      return new Date(b.release_date) - new Date(a.release_date);
    } else if (sortOption === "rating") {
      return b.vote_average - a.vote_average;
    }
    return 0;
  });

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!playlist) return <Typography>Playlist not found.</Typography>;

  return (
    <>
    <Navbar /> {/* Navbar is outside the constrained container */}
    <div className="playlist-container light-theme">
      {/* Editable Banner Section */}
      <Box className="playlist-banner" sx={{ position: "relative", height: "300px", overflow: "hidden" }}>
        {isEditing ? (
          <label htmlFor="thumbnail-upload" className="upload-banner">
            {editData.thumbnail ? (
              <img src={editData.thumbnail} alt="Updated Thumbnail" className="banner-image" />
            ) : (
              <Box className="upload-placeholder">
                <AddAPhoto fontSize="large" />
                <Typography>Upload Thumbnail</Typography>
              </Box>
            )}
            <input
              type="file"
              accept="image/*"
              id="thumbnail-upload"
              style={{ display: "none" }}
              onChange={handleUpload}
            />
          </label>
        ) : (
          <img src={playlist.thumbnail} alt={playlist.playlistTitle} className="banner-image" />
        )}
      </Box>

      {/* Playlist Content */}
      <Container className="playlist-content">
        {/* Playlist Title and Icons */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" className="playlist-title">
            {playlist.playlistTitle}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {isEditing ? (
              <>
                <IconButton onClick={handleSave} className="save-btn">
                  <Save />
                </IconButton>
                <IconButton onClick={() => setIsEditing(false)} className="cancel-btn">
                  <Close />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton onClick={handleEdit} className="edit-btn">
                  <Edit />
                </IconButton>
                <IconButton onClick={handleDelete} className="delete-btn">
                  <Delete />
                </IconButton>
              </>
            )}
          </Box>
        </Box>

        {/* Playlist Description */}
        <Typography variant="body1" className="playlist-description">
          {playlist.description}
        </Typography>

        {isEditing ? (
          <>
            <TextField
              fullWidth
              label="Playlist Title"
              value={editData.playlistTitle}
              onChange={(e) => setEditData({ ...editData, playlistTitle: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
              sx={{ mb: 2 }}
            />
            {/* Add Movie Section */}
            <Typography variant="h6" sx={{ mt: 2, mb: 2 }}>
              Add Movies
            </Typography>
            <TextField
              fullWidth
              label="Search for movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              {searchResults.map((movie) => (
                <Grid item key={movie.id} xs={4} sm={3} md={2} lg={2}>
                  <Card onClick={() => handleAddMovie(movie)} className="movie-card">
                    <CardMedia
                      component="img"
                      height="140"
                      image={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={movie.title}
                      className="movie-image"
                    />
                    <CardContent className="movie-content">
                      <Typography variant="body2" className="movie-title">
                        {movie.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : null}

        {/* Filters and Sort Section */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          {/* Browse by Filters (Left Side) */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Year</InputLabel>
              <Select value={yearFilter} onChange={handleYearFilterChange} label="Year">
                <MenuItem value={"all"}>All</MenuItem>
                <MenuItem value={"2024"}>2024</MenuItem>
                <MenuItem value={"2023"}>2023</MenuItem>
                <MenuItem value={"2022"}>2022</MenuItem>
                <MenuItem value={"2021"}>2021</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Rating</InputLabel>
              <Select value={ratingFilter} onChange={handleRatingFilterChange} label="Rating">
                <MenuItem value={"all"}>All</MenuItem>
                <MenuItem value={"7"}>7+</MenuItem>
                <MenuItem value={"8"}>8+</MenuItem>
                <MenuItem value={"9"}>9+</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Genre</InputLabel>
              <Select value={genreFilter} onChange={handleGenreFilterChange} label="Genre">
                <MenuItem value={"all"}>All</MenuItem>
                <MenuItem value={"28"}>Action</MenuItem>
                <MenuItem value={"18"}>Drama</MenuItem>
                <MenuItem value={"35"}>Comedy</MenuItem>
                <MenuItem value={"27"}>Horror</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Sort by Filter (Right Side) */}
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortOption} onChange={handleSortChange} label="Sort By">
              <MenuItem value={"default"}>Default</MenuItem>
              <MenuItem value={"title"}>Title</MenuItem>
              <MenuItem value={"release_date"}>Release Date</MenuItem>
              <MenuItem value={"rating"}>Rating</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Movies Grid */}
        <Grid container spacing={2} className="movies-grid">
          {sortedMovies.length > 0 ? (
            sortedMovies.map((movie) => (
              <Grid item key={movie.id} xs={4} sm={3} md={2} lg={2}>
                <Card className="movie-card" onClick={() => handleMovieClick(movie.id)}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : "/placeholder.jpg"}
                    alt={movie.title}
                    className="movie-image"
                  />
                  <CardContent className="movie-content">
                    <Typography variant="body2" className="movie-title">
                      {movie.title}
                    </Typography>
                  </CardContent>
                  {isEditing && (
                    <IconButton
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemoveMovie(movie.id);
                      }}
                      className="remove-icon"
                    >
                      <Close />
                    </IconButton>
                  )}
                </Card>
              </Grid>
            ))
          ) : (
            <Typography className="no-movies-text">No movies found in this playlist.</Typography>
          )}
        </Grid>
      </Container>
    </div>
    </>
  );
};

export default PlaylistDetails;