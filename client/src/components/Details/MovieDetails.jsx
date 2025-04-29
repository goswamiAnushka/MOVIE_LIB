import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./MovieDetails.css";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { useNavigate } from 'react-router-dom';
import axiosCustom from "../../Services/AxiosConfig/axiosCustom";
import { useSelector } from "react-redux";  // Import useSelector
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Navbar from '../Navbar/Navbar';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Snackbar, Alert } from "@mui/material";
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
SwiperCore.use([Navigation]);
const API_KEY= import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const apiClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});
function MovieDetails() {
  const { id } = useParams(); // Get the movie ID from the URL
  const [movie, setMovie] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [releases, setReleases] = useState([]); // Define releases state
  const [director, setDirector] = useState(null);
  const [showAllCrew, setShowAllCrew] = useState(false);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [averageScores, setAverageScores] = useState(null); // Store average scores
  const user = useSelector((state) => state.user.user); // Get user from Redux
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu
  const [isLiked, setIsLiked] = useState(false);
  const [playlists, setPlaylists] = useState([]); // State to store user's playlists
  const toggleCrewVisibility = () => {
    setShowAllCrew((prev) => !prev);
  };
  const handleDeleteReview = async (reviewId) => {
    try {
      await axiosCustom.delete(`/reviews/${reviewId}`); 
      setReviews(reviews.filter((review) => review._id !== reviewId)); 
    } catch (error) {
      console.error("Error deleting review:", error);
      alert("Failed to delete review. Please try again.");
    }
  };
  const handleOpenDialog = (review) => {
    setSelectedReview(review);
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedReview(null);
  };
  const handleMenuOpen = async (event) => {
    setAnchorEl(event.currentTarget);
    try {
      const response = await axiosCustom.get("/playlist"); // Fetch playlists
      setPlaylists(response.data);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCreatePlaylist = () => {
    navigate("/playlist"); // Navigate to the PlaylistPage
  };
  const handleAddToPlaylist = async (playlistId) => {
    try {
      const playlist = await axiosCustom.get(`/playlist/${playlistId}`);
      const updatedMovies = [...playlist.data.movies, movie]; 
      await axiosCustom.put(`/playlist/${playlistId}`, { movies: updatedMovies }); 
      alert("Movie added to playlist successfully!");
    } catch (error) {
      console.error("Error adding movie to playlist:", error);
      alert("Failed to add movie to playlist. Please try again.");
    }
    handleMenuClose();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  
  // Confirm Delete Review
  const confirmDelete = async () => {
    if (selectedReview) {
      try {
        await handleDeleteReview(selectedReview._id);
        setSnackbar({ open: true, message: "Review deleted successfully!", severity: "success" });
      } catch (error) {
        setSnackbar({ open: true, message: "Failed to delete review!", severity: "error" });
      }
    }
    handleCloseDialog();
  };
  // Refs for each section
  const detailsRef = useRef(null);
  const reviewsRef = useRef(null);
  const trailersRef = useRef(null);
  const castRef = useRef(null);
  const crewRef = useRef(null);
  const releasesRef = useRef(null);
  const playlistsRef = useRef(null);
  const navigate = useNavigate();
  const handleClick = (movieId) => {
    navigate(`/movie/${movieId}`, { state: { scrollToTop: true } });
    window.scrollTo(0, 0); 
  };
  const handleWriteReview = () => {
  
  
    console.log("Current User ID:", user._id);
    console.log("Reviews Data:", reviews);
  
    // Check if the user has already reviewed this movie
    const existingReview = reviews.find((review) => {
      console.log("Checking review:", review);
      return review.userId === user._id;
    });
  
    console.log("Existing Review Found:", existingReview);
  
    if (existingReview) {
      console.log("Navigating to Edit Review:", `/edit-review/${existingReview._id}`);
      navigate(`/edit-review/${existingReview._id}`, { state: { movie, review: existingReview } });
    } else {
      console.log("Navigating to Write Review:", `/write-review/${movie.id}`);
      navigate(`/write-review/${movie.id}`, { state: { movie } });
    }
  };

  
  const [activeTab, setActiveTab] = useState("DETAILS");
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Fetch movie details and credits concurrently
        const [movieResponse, creditsResponse] = await Promise.all([
          apiClient.get(`/movie/${id}`),
          apiClient.get(`/movie/${id}/credits`),
        ]);

        // Set movie details and include credits
        setMovie({
          ...movieResponse.data,
          credits: creditsResponse.data, 
        });

        // Extract and set the director name
        const director = creditsResponse.data.crew.find(
          (crew) => crew.job === "Director"
        );
        setDirector(director?.name || "Unknown");

        // Fetch and set keywords
        const keywordsResponse = await apiClient.get(`/movie/${id}/keywords`);
        setKeywords(keywordsResponse.data.keywords || []);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    };

    
const fetchReviews = async () => {
  if (!movie?.id) return;

  try {
    const response = await axiosCustom.get(`/reviews/movie/${movie.id}`);
    console.log("Fetched Reviews:", response.data);

    const reviewsData = response.data.reviews || [];
    setReviews(reviewsData);

    // Calculate average scores
    if (reviewsData.length > 0) {
      const totalReviews = reviewsData.length;
      const avgScores = reviewsData.reduce(
        (acc, r) => {
          acc.general += r.generalScore;
          acc.plot += r.plotScore;
          acc.story += r.storyScore;
          acc.character += r.characterScore;
          acc.cinematography += r.cinematographyScore;
          acc.rate += r.rateScore;
          return acc;
        },
        { general: 0, plot: 0, story: 0, character: 0, cinematography: 0, rate: 0 }
      );

      setAverageScores({
        general: (avgScores.general / totalReviews).toFixed(1),
        plot: (avgScores.plot / totalReviews).toFixed(1),
        story: (avgScores.story / totalReviews).toFixed(1),
        character: (avgScores.character / totalReviews).toFixed(1),
        cinematography: (avgScores.cinematography / totalReviews).toFixed(1),
        rate: (avgScores.rate / totalReviews).toFixed(1),
      });
    }
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    setError("Failed to fetch reviews. Please try again later.");
  }
};

    const fetchTrailers = async () => {
      try {
        const response = await apiClient.get(`/movie/${id}/videos`);
        const filteredTrailers = response.data.results.filter(
          (video) => video.type === "Trailer" && video.site === "YouTube"
        );
        setTrailers(filteredTrailers);
      } catch (error) {
        console.error("Error fetching movie trailers:", error);
      }
    };

    const fetchReleases = async () => {
      try {
        const response = await apiClient.get(`/movie/${id}/release_dates`);
        setReleases(response.data.results || []);
      } catch (error) {
        console.error("Error fetching movie releases:", error);
      }
    };

    const fetchSimilarMovies = async () => {
      try {
        const response = await apiClient.get(`/movie/${id}/similar`);
        setSimilarMovies(response.data.results || []);
      } catch (error) {
        console.error("Error fetching similar movies:", error);
      }
    };

    fetchMovieDetails();
    fetchReviews();
    fetchTrailers();
    fetchReleases();
    fetchSimilarMovies();
  }, [id,movie?.id]);

  useEffect(() => {
    const sections = [
      { name: "DETAILS", ref: detailsRef },
      { name: "REVIEWS", ref: reviewsRef },
      { name: "TRAILERS", ref: trailersRef },
      { name: "CAST", ref: castRef },
      { name: "CREW", ref: crewRef },
      { name: "RELEASES", ref: releasesRef },
      { name: "SIMILAR MOVIES", ref: playlistsRef },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(entry.target.getAttribute("data-section"));
          }
        });
      },
      {
        rootMargin: "-50% 0px", 
      }
    );
    sections.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });
    return () => {
      observer.disconnect();
    };
  }, []);
  if (!movie) return <div>Loading...</div>;
 return (
  <div>
    {/* Navbar - Above everything */}
    <Navbar />

    <div className="total">
      <div className="movie-details">
        {/* Banner */}
        <div
  className="movie-details__banner"
  style={{
    backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
    backgroundSize: "cover",
    backgroundPosition: "center center",
  }}
></div>

{/* Log backdrop path */}
{console.log("Backdrop URL:", `${IMAGE_BASE_URL}${movie.backdrop_path}`)}

{/* Content Section */}
<div className="movie-details__content">
  {/* Poster */}
  <img
    className="movie-details__poster"
    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
    alt={movie.title}
  />

  {/* Log poster path */}
  {console.log("Poster URL:", `${IMAGE_BASE_URL}${movie.poster_path}`)}


  <div className="movie-details__info">
      <h1 className="movie-details__title">{movie.title}</h1>
      <p className="movie-details__year">
        {movie.release_date?.split("-")[0]} • {movie.runtime} min
      </p>
      <p className="movie-details__overview">{movie.overview}</p>
      <div className="movie-details__actions">
        <button className="movie-details__rent-button">Rent Movie ($0.99)</button>

        {/* Add to Playlist Button with Dropdown */}
        <div className="movie-details__playlist-container">
          <button
            className="movie-details__playlist-button"
            onClick={handleMenuOpen}
          >
            <PlaylistAddIcon className="save-icon" /> Add to Playlist{" "}
            <ArrowDropDownIcon className="dropdown-icon" />
          </button>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleCreatePlaylist}>Create +</MenuItem> {/* Navigates to /playlist */}
            {playlists.map((playlist) => (
              <MenuItem
                key={playlist._id}
                onClick={() => handleAddToPlaylist(playlist._id)}
              >
                {playlist.playlistTitle}
              </MenuItem>
            ))}
          </Menu>
        </div>
        {/* Heart Icon */}
        <Tooltip title={isLiked ? "Unlike" : "Like"}>
          <IconButton onClick={handleLike} className="heart-icon">
            {isLiked ? (
              <FavoriteIcon style={{ color: "red" }} />
            ) : (
              <FavoriteBorderIcon style={{ color: "rgba(255, 255, 255, 0.8)" }} />
            )}
          </IconButton>
        </Tooltip>
      </div>
    </div>
  </div>

        {/* Tabs Section */}
        <div className="movie-details__tabs">
          <ul>
            {["DETAILS", "REVIEWS", "TRAILERS", "CAST", "CREW", "RELEASES", "SIMILAR MOVIES"].map((tab) => (
              <li
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => {
                  const refMap = {
                    DETAILS: detailsRef,
                    REVIEWS: reviewsRef,
                    TRAILERS: trailersRef,
                    CAST: castRef,
                    CREW: crewRef,
                    RELEASES: releasesRef,
                    "SIMILAR MOVIES": playlistsRef, // Fix: Quotes around "SIMILAR MOVIES"
                  };
                  refMap[tab]?.current?.scrollIntoView({ behavior: "smooth" }); // Ensure refs are optional chained
                }}
              >
                {tab}
              </li>
            ))}
          </ul>
        </div>

        {/* Updated Details Section */}
        <div ref={detailsRef} className="movie-details__section" data-section="DETAILS">
          <h2>Details</h2>
          <div className="details-container">
            <div className="details-left">
              <div>
                <strong>Director:</strong>
                {Array.isArray(director)
                  ? director.map((name, index) => (
                      <span key={index} className="details-tag">
                        {name}
                      </span>
                    ))
                  : <span className="details-tag">{director}</span>}
              </div>
              <div>
                <strong>Language:</strong> {movie.spoken_languages.map((lang) => lang.english_name).join(", ")}
              </div>
              <div>
                <strong>Studio:</strong>
                {movie.production_companies.map((company, index) => (
                  <span key={company.id || `company-${index}`} className="details-tag">
                    {company.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="details-right">
              <div>
                <strong>Genres:</strong>
                {movie.genres.map((genre, index) => (
                  <span key={genre.id || `genre-${index}`} className="details-tag">
                    {genre.name}
                  </span>
                ))}
              </div>

              <div>
                <strong>Tags:</strong>
                {keywords.map((keyword, index) => (
                  <span key={keyword.id || `keyword-${index}`} className="details-tag">
                    {keyword.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="review-section">
          <div className="movie-details__section" data-section="REVIEWS">
            <h2>Movie Sharer’s Reviews</h2>
            {averageScores && (
              <div className="average-score-container">
                <span className="total-score-label">Total Score:</span>
                <div className="score-box">⭐ {Math.round(averageScores.general)} / 10</div>
                <div className="score-details">
                  <div className="score-item">Plot {Math.round(averageScores.plot)}/10</div>
                  <div className="score-item">Story {Math.round(averageScores.story)}/10</div>
                  <div className="score-item">Characters {Math.round(averageScores.character)}/10</div>
                  <div className="score-item">Cinematography {Math.round(averageScores.cinematography)}/10</div>
                  <div className="score-item">Pacing {Math.round(averageScores.rate)}/10</div>
                </div>
              </div>
            )}

            <button className="write-review-button" onClick={handleWriteReview}>
              <i className="fas fa-comment-dots"></i> Write a Review
            </button>
            <div className="reviews-list">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review._id} className="review-card">
                    <img
                      src={review.avatar ? review.avatar : "/images/default-avatar.png"}
                      alt={review.username || "Anonymous"}
                      className="review-avatar"
                      onError={(e) => (e.target.src = "/images/default-avatar.png")}
                    />
                    <div className="review-card-right">
                      <div className="review-header">
                        <div>
                          <p className="review-author">{review.username || "Anonymous"}</p>
                          <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                        <p className="review-score">{review.generalScore} / 10 ⭐</p>
                      </div>
                      {user && review.userId === user._id && (
                        <div className="review-actions">
                          <EditIcon
                            className="edit-icon"
                            onClick={() => navigate(`/edit-review/${review._id}`, { state: { movie, review } })}
                          />
                          <DeleteIcon
                            className="delete-icon"
                            onClick={() => handleOpenDialog(review)}
                          />
                        </div>
                      )}
                      <div className="review-body">
                        <h3 className="review-title">{review.review_title}</h3>
                        <p className="review-content">
                          {review.review_details
                            ? `“${review.review_details.slice(0, 150)}..."`
                            : "No review content available."}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No reviews available for this movie.</p>
              )}
            </div>
         {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this review? This action cannot be undone.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  </div>
</div>

      {/* Trailers Section */}
      <div className="trailer-section">
      <div ref={trailersRef} className="movie-details__section trailers-section" data-section="TRAILERS">
        <h2 className="trailers-title">Trailers</h2>
        <div className="trailers-line"></div>

        {trailers.length > 0 ? (
          <>
            {/* Highlighted Trailer */}
            <div className="trailers-highlight">
              <iframe
                src={`https://www.youtube.com/embed/${trailers[0].key}`}
                title={trailers[0].name}
                className="highlighted-trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <button
                className="youtube-button"
                onClick={() => window.open(`https://www.youtube.com/watch?v=${trailers[0].key}`, "_blank")}
              ></button>
            </div>

            {/* Swiper for other trailers */}
            <Swiper
              spaceBetween={10}
              slidesPerView={3}
              navigation
              pagination={{ clickable: true }}
              className="trailers-swiper"
            >
              {trailers.slice(1).map((trailer) => (
                <SwiperSlide key={trailer.id} className="trailer-slide">
                  <iframe
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title={trailer.name}
                    className="swiper-trailer"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <p className="trailer-name">{trailer.name}</p>
                </SwiperSlide>
              ))}
            </Swiper>
          </>
        ) : (
          <p className="no-trailers">No trailers available for this movie.</p>
        )}
      </div>
      </div>

    {/* Cast Section */}
    <div className="Cast-Section">
    <div
        ref={castRef}
        className="movie-details__section cast-section"
        data-section="CAST"
      >
        <h2 className="section-title">Cast</h2>
        <div className="section-line"></div>
        {movie.credits?.cast && movie.credits.cast.length > 0 ? (
          <Swiper
            spaceBetween={10}
            slidesPerView={6}
            navigation
            className="cast-swiper"
          >
            {movie.credits.cast.map((actor) => (
                <SwiperSlide 
                key={actor.id}
                className="cast-slide"
                onClick={() => navigate(`/person/${actor.id}`)}
              >
                <div className="cast-item">
                  <img
                    src={
                      actor.profile_path
                        ? `${IMAGE_BASE_URL}${actor.profile_path}`
                        : "/images/default-avatar.png"
                    }
                    alt={actor.name}
                    className="cast-image"
                  />
                  <p className="cast-name">{actor.name}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="no-data">No cast information available.</p>
        )}
      </div>
</div>
      {/* Crew Section */}
      <div className="movie-details__section crew-section" data-section="CREW">
        <h2 className="section-title">Crew</h2>
        <div className="section-line"></div>
        {movie.credits?.crew && movie.credits.crew.length > 0 ? (
          <div>
            <div
              className="crew-roles"
              style={{ maxHeight: showAllCrew ? "none" : "150px" }}
            >
              {Object.entries(
                movie.credits.crew.reduce((acc, crewMember) => {
                  if (!acc[crewMember.job]) acc[crewMember.job] = [];
                  acc[crewMember.job].push(crewMember);
                  return acc;
                }, {})
              ).map(([role, crewMembers]) => (
                <div key={role} className="crew-role">
                  <strong>{role}</strong>
                  <div className="crew-names">
                    {crewMembers.map((crewMember, index) => (
                      <span
                        key={index}
                        className="crew-name"
                        onClick={() => navigate(`/person/${crewMember.id}`)}
                      >
                        {crewMember.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="see-all-button"
              onClick={toggleCrewVisibility}
            >
              {showAllCrew ? "Show Less" : "See All"}
            </button>
          </div>
        ) : (
          <p className="no-data">No crew information available.</p>
        )}
      </div>
      {/* Releases Section */}
      <div ref={releasesRef} className="movie-details__section releases-section" data-section="RELEASES">
        <h2 className="section-title">Releases</h2>
        {releases.length > 0 ? (
          <Swiper
            spaceBetween={16}
            slidesPerView={3}
            navigation
            pagination={{ clickable: true }}
            className="release-swiper"
          >
            {releases.map((release) => (
              <SwiperSlide key={release.iso_3166_1}>
                <div className="release-card">
                  <img
                    src={`/images/release-icon.png`} // Replace with your image path
                    alt="Release Icon"
                    className="release-icon" />
                  <div className="release-info">
                    <strong>{release.iso_3166_1}:</strong>
                    {release.release_dates.map((date) => (
                      <div key={date.certification} className="release-date-cert">
                        <span className="release-date">
                          {date.release_date.split("T")[0]}
                        </span>{" "}
                        -{" "}
                        <span className="release-certification">
                          {date.certification || "Unrated"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="no-info">No release information available.</p>
        )}
      </div>
      <div ref={playlistsRef} className="movie-details__section similar-movies-section" data-section="SIMILAR_MOVIES">
  <h2 className="section-title">Similar Movies</h2>
  {similarMovies.length > 0 ? (
    <Swiper
      spaceBetween={20}
      slidesPerView={3} 
      breakpoints={{
        1024: {
          slidesPerView: 3,
        },
        768: {
          slidesPerView: 2,
        },
        480: {
          slidesPerView: 1,
        },
      }}
    >
      {similarMovies.map((movie) => (
        <SwiperSlide key={movie.id} className="similar-movie-item">
          <div className="movie-card">
            <div onClick={() => handleClick(movie.id)} className="movie-link">
              <img
                src={movie.poster_path 
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
                  : "/images/movie-default.png"} 
                alt={`${movie.title} Poster`}
                className="movie-poster" />
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-release-date">{movie.release_date}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  ) : (
    <p className="no-info">No similar movies available.</p>
  )}


      </div>
    </div>
  </div>

);
}

export default MovieDetails;