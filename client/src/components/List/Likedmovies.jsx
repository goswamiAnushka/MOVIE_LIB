import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import axiosCustom from "../../Services/AxiosConfig/axiosCustom";
import { useNavigate } from "react-router-dom";
import { IconButton, Tooltip, CircularProgress } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Navbar from "../Navbar/Navbar";
import { motion } from "framer-motion";
import "./LikeList.css";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

const fetchData = async (endpoint, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};

const LikedMovies = () => {
  const [likedMovies, setLikedMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();
  const observer = useRef(null);

  // Fetch liked movies
  const fetchLikedMovies = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const response = await axiosCustom.get(`/like/liked-movies?page=${page}&limit=8`);
      if (response.status === 200 && response.data.length > 0) {
        const likedMovieIds = response.data.map((item) => item.movieId);

        // Fetch movie details for each liked movie ID
        const movieDetails = await Promise.all(
          likedMovieIds.map((movieId) => fetchData(`/movie/${movieId}`))
        );

        const validMovies = movieDetails.filter((movie) => movie !== null);

        setLikedMovies((prev) => [...prev, ...validMovies]);
        setHasMore(response.data.length === 8); // Update `hasMore` based on response size
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching liked movies:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchLikedMovies();
  }, []);

  // Intersection Observer for Infinite Scrolling
  const lastMovieRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchLikedMovies();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleLike = async (movieId, e) => {
    e.stopPropagation();
    try {
      const response = await axiosCustom.post("/like/unlike", { movieId });
      if (response.status === 200) {
        setLikedMovies((prev) => prev.filter((movie) => movie.id !== movieId));
      }
    } catch (error) {
      console.error("Error unliking movie:", error);
    }
  };

  const handleNavigate = (movieId, e) => {
    e.stopPropagation();
    navigate(`/movie/${movieId}`);
  };

  const DEFAULT_IMAGE = "/images/movie-default.png";

  return (
    <div className="movie-list">
      <Navbar />
      <div className="movie-container">
        <h2 className="movie-row__title">Movies You Liked ❤️</h2>

        <div className="liked-movies-grid">
          {likedMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              className="movie-card"
              onClick={(e) => handleNavigate(movie.id, e)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              ref={index === likedMovies.length - 1 ? lastMovieRef : null} // Attach observer to last item
            >
              <img
                className="movie-poster"
                src={movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : DEFAULT_IMAGE}
                alt={movie.title || movie.name}
                onError={(e) => (e.target.src = DEFAULT_IMAGE)}
              />
              <div className="movie-info">
                <h4>{movie.title || movie.name}</h4>
              </div>
              <Tooltip title="Unlike">
                <IconButton onClick={(e) => handleLike(movie.id, e)} className="like-button">
                  <FavoriteIcon className="liked" />
                </IconButton>
              </Tooltip>
            </motion.div>
          ))}
        </div>

        {loading && <CircularProgress className="loading-spinner" />}
        {!hasMore && <p className="no-more-movies">No more movies to load.</p>}
      </div>
    </div>
  );
};

export default LikedMovies;
