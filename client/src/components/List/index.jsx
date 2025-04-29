import React, { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import { useNavigate, Link } from "react-router-dom";
import "./MovieList.css";
import { Navigation, Scrollbar, Pagination } from "swiper/modules";
import "react-datepicker/dist/react-datepicker.css";
import "../responsive.css";
import "../dark.css";
import "../developer.css";
import Navbar from "../Navbar/Navbar";
import { IconButton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axiosCustom from "../../Services/AxiosConfig/axiosCustom";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import DatePicker from "react-datepicker";
import { FaStar } from "react-icons/fa";
import { Typography } from "@mui/material";

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

const fetchData = async (endpoints) => {
  try {
    const responses = await Promise.all(
      endpoints.map((endpoint) => apiClient.get(endpoint))
    );
    return responses.map((res) => res.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

const Banner = ({ movies }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  if (!movies || movies.length === 0) return null;

  const handleNavigation = (movieId) => {
    setLoading(true);
    setTimeout(() => navigate(`/movie/${movieId}`), 100);
  };

  return (
    <div className="banner-slider">
      <Swiper modules={[Pagination]} pagination={{ clickable: true }} spaceBetween={0} slidesPerView={1} loop>
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <header
              className="banner"
              style={{
                backgroundImage: `url(${IMAGE_BASE_URL}${movie.backdrop_path})`,
                backgroundSize: "cover",
                backgroundPosition: "center center",
              }}
            >
              <div className="banner__contents">
                <h1 className="banner__title">{movie.title || movie.name}</h1>
                <div className="banner__buttons">
                  <button className="banner__button" onClick={() => handleNavigation(movie.id)} disabled={loading}>
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Movie Details →"}
                  </button>
                  <button className="banner__button">Add To Playlist</button>
                </div>
                <p className="banner__description">{movie.overview}</p>
              </div>
              <div className="banner--fadeBottom" />
            </header>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const Row = ({ title, movies, isLargeRow = false, likedMovieIds, onLike }) => {
  const navigate = useNavigate();
  const handleNavigate = (movieId, e) => {
    e.stopPropagation();
    navigate(`/movie/${movieId}`);
  };

  return (
    <div className="movie-row">
      <h2 className="movie-row__title">{title}</h2>
      <Swiper modules={[Navigation, Scrollbar]} navigation scrollbar={{ draggable: true }} spaceBetween={10} slidesPerView={isLargeRow ? 6 : 5}>
        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={(e) => handleNavigate(movie.id, e)}>
              <img className={`movie-row__poster ${isLargeRow ? "movie-row__posterLarge" : ""}`} src={IMAGE_BASE_URL + movie.poster_path} alt={movie.title || movie.name} loading="lazy" />
              <Tooltip title={likedMovieIds.has(movie.id) ? "Unlike" : "Like"}>
                <IconButton
                  onClick={(e) => { e.stopPropagation(); onLike(movie.id); }}
                  style={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.5)", 
                    borderRadius: "50%", 
                    padding: "8px", 
                    color: likedMovieIds.has(movie.id) ? "red" : "rgba(255, 255, 255, 0.8)", 
                    transition: "all 0.3s ease", 
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; 
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; 
                  }}
                >
                  {likedMovieIds.has(movie.id) ? (
                    <FavoriteIcon style={{ color: "red" }} /> 
                  ) : (
                    <FavoriteBorderIcon style={{ color: "rgba(255, 255, 255, 0.8)" }} /> 
                  )}
                </IconButton>
              </Tooltip>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

const PlaylistRow = ({ playlists }) => {
  const navigate = useNavigate();

  return (
    <div className="movie-row">
      <h2 className="movie-row__title">Your Playlists</h2>
      <Swiper
        modules={[Navigation, Scrollbar]}
        navigation
        scrollbar={{ draggable: true }}
        spaceBetween={10}
        slidesPerView={5}
      >
        {playlists.map((playlist) => (
          <SwiperSlide key={playlist._id}>
            <div
              className="playlist-card"
              onClick={() => navigate(`/playlist/${playlist._id}`)}
            >
              {/* Playlist Banner */}
              <div
                className="playlist-banner"
                style={{
                  backgroundImage: `url(${playlist.thumbnail})`,
                }}
              ></div>
              {/* Playlist Name */}
              <Typography variant="h6" className="playlist-name">
                {playlist.playlistTitle}
              </Typography>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Link to="/playlists" className="see-all-link">
        See All →
      </Link>
    </div>
  );
};
const Filter = ({ onFilterChange, onResetFilters, genres, filters }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="filter">
      <select onChange={(e) => onFilterChange("genre", e.target.value)} className="filter__dropdown" value={filters.genre}>
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>

      <DatePicker
        selected={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
          onFilterChange("releaseYear", date?.getFullYear() || "");
        }}
        showYearPicker
        dateFormat="yyyy"
        placeholderText="Select Release Year"
        className="filter__datePicker"
      />

      <div className="filter__rating">
        {[...Array(10)].map((_, index) => (
          <FaStar
            key={index}
            className={`filter__star ${index + 1 <= (parseInt(filters.rating) || 0) ? "active" : ""}`}
            onClick={() => onFilterChange("rating", index + 1)}
          />
        ))}
      </div>

      <select onChange={(e) => onFilterChange("sortBy", e.target.value)} className="filter__dropdown" value={filters.sortBy}>
        <option value="">Sort By</option>
        <option value="popularity.desc">Popularity</option>
        <option value="release_date.desc">Release Date</option>
        <option value="vote_average.desc">Rating</option>
      </select>

      <button onClick={onResetFilters} className="filter__reset">
        Reset Filters
      </button>
    </div>
  );
};

const MovieList = () => {
  const [movies, setMovies] = useState({ trending: [], topRated: [], upcoming: [], nowPlaying: [] });
  const [likedMovies, setLikedMovies] = useState([]);
  const [likedMovieIds, setLikedMovieIds] = useState(new Set());
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genre: "",
    releaseYear: "",
    rating: "",
    sortBy: "",
  });
  const [isFiltered, setIsFiltered] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const [trending, topRated, upcoming, nowPlaying, genres] = await fetchData([
        "/trending/movie/week",
        "/movie/top_rated",
        "/movie/upcoming",
        "/movie/now_playing",
        "/genre/movie/list",
      ]);
      setMovies({ trending: trending.results, topRated: topRated.results, upcoming: upcoming.results, nowPlaying: nowPlaying.results });
      setGenres(genres.genres);
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const fetchLikedMovies = async () => {
      try {
        const response = await axiosCustom.get("/like/liked-movies");
        if (response.status === 200) {
          const likedIds = new Set(response.data.map((item) => item.movieId));
          setLikedMovieIds(likedIds);
          const first10LikedIds = [...likedIds].slice(0, 10);
          const likedDetails = await Promise.all(first10LikedIds.map((id) => fetchData([`/movie/${id}`])));
          setLikedMovies(likedDetails.map(res => res[0]));
        }
      } catch (error) {
        console.error("Error fetching liked movies:", error);
      }
    };
    fetchLikedMovies();
  }, []);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await axiosCustom.get("/playlist");
        setPlaylists(response.data.slice(0, 10)); // Fetch first 10 playlists
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };
    fetchPlaylists();
  }, []);

  const handleLike = async (movieId) => {
    try {
      const endpoint = likedMovieIds.has(movieId) ? "/like/unlike" : "/like/like";
      const response = await axiosCustom.post(endpoint, { movieId });
  
      if (response.status === 200) {
        setLikedMovieIds((prev) => {
          const newLikedMovieIds = new Set(prev);
          if (newLikedMovieIds.has(movieId)) {
            newLikedMovieIds.delete(movieId);
          } else {
            newLikedMovieIds.add(movieId);
          }
          return newLikedMovieIds;
        });
  
        if (likedMovieIds.has(movieId)) {
          setLikedMovies((prev) => prev.filter((movie) => movie.id !== movieId));
        } else {
          const movieDetails = await fetchData([`/movie/${movieId}`]);
          setLikedMovies((prev) => [...prev, movieDetails[0]]);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
    setIsFiltered(true);
  };

  const handleResetFilters = () => {
    setFilters({
      genre: "",
      releaseYear: "",
      rating: "",
      sortBy: "",
    });
    setIsFiltered(false);
  };

  const filterMovies = (movies, filters) => {
    return movies.filter((movie) => {
      const matchesGenre = !filters.genre || movie.genre_ids.includes(Number(filters.genre));
      const matchesYear = !filters.releaseYear || new Date(movie.release_date).getFullYear() === Number(filters.releaseYear);

      const matchesRating = !filters.rating || movie.vote_average >= Number(filters.rating);
      return matchesGenre && matchesYear && matchesRating;
    }).sort((a, b) => {
      if (filters.sortBy === "popularity.desc") {
        return b.popularity - a.popularity;
      } else if (filters.sortBy === "release_date.desc") {
        return new Date(b.release_date) - new Date(a.release_date);
      } else if (filters.sortBy === "vote_average.desc") {
        return b.vote_average - a.vote_average;
      }
      return 0;
    });
  };

  const allMovies = [...movies.trending, ...movies.topRated, ...movies.upcoming, ...movies.nowPlaying];
  const filteredMovies = isFiltered ? filterMovies(allMovies, filters) : [];

  return (
    <div className="movie-list">
      <Navbar />
      <Banner movies={movies.trending.slice(0, 5)} />
      <Filter
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        genres={genres}
        filters={filters}
      />

      {isFiltered ? (
        <Row
          title="Filtered Movies"
          movies={filteredMovies}
          likedMovieIds={likedMovieIds}
          onLike={handleLike}
        />
      ) : (
        <>
          {likedMovies.length > 0 && (
            <div className="liked-movies-section">
              <Row
                title="Movies Liked by You"
                movies={likedMovies.slice(0, 10)}
                isLargeRow={true}
                likedMovieIds={likedMovieIds}
                onLike={handleLike}
              />
              <Link to="/liked-movies" className="see-all-link">
                See All →
              </Link>
            </div>
          )}

          {playlists.length > 0 && (
            <PlaylistRow playlists={playlists} />
          )}

          <Row
            title="Trending Movies"
            movies={movies.trending}
            likedMovieIds={likedMovieIds}
            onLike={handleLike}
          />
          <Row
            title="Top Rated Movies"
            movies={movies.topRated}
            likedMovieIds={likedMovieIds}
            onLike={handleLike}
          />
          <Row
            title="Upcoming Movies"
            movies={movies.upcoming}
            likedMovieIds={likedMovieIds}
            onLike={handleLike}
          />
          <Row
            title="Now Playing"
            movies={movies.nowPlaying}
            likedMovieIds={likedMovieIds}
            onLike={handleLike}
          />
        </>
      )}
    </div>
  );
};

export default MovieList;