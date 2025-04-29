import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Auth/Register/index";
import Login from "./components/Auth/Login/index";
import ForgotPassword from "./components/Auth/Forgot-Password/index";
import ResetPassword from "./components/Auth/Reset-Password/index";
import MovieList from "./components/List/index";
import Community from './components/Community/Community';
import MovieDetails from "./components/Details/MovieDetails";
import Person from "./components/Person/person";
import WriteReviewPage from "./components/Review/WriteReviewPage";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import EditReviewPage from "./components/Review/EditReviewPage";
import LikedMovies from "./components/List/Likedmovies";
import PlaylistPage from "./components/Playlist/Playlist";
import PlaylistList from "./components/List/playlistlist";
import PlaylistDetails from "./components/Playlist/playlistDetails";
import Sidebar from "./components/Sidebar/Sidebar"; // Add this import

const App = () => {
  return (
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/reset_password" element={<ResetPassword />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/community" element={<Community />} />
          <Route path="/list" element={<MovieList />} />
          <Route path="/liked-movies" element={<LikedMovies />} />
          <Route path="/playlists" element={<PlaylistList />} />
          <Route path="/playlist/:playlistId" element={<PlaylistDetails />} />
          <Route path="/playlist" element={<PlaylistPage />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/write-review/:movieId" element={<WriteReviewPage />} />
          <Route path="/edit-review/:reviewId" element={<EditReviewPage />} />
          <Route path="/person/:personId" element={<Person />} />
          <Route path="/navbar" element={<Navbar />} />
          <Route path="/sidebar" element={<Sidebar />} />
        </Route>
      </Routes>
  );
};

export default App;