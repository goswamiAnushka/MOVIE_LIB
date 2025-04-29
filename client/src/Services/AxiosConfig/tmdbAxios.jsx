
// src/api/tmdb.js
import axios from 'axios';

const tmdbAxios = axios.create({
  baseURL: process.env.REACT_APP_TMDB_URL,
  headers: {
    Authorization: process.env.REACT_APP_TMDB_TOKEN,
  },
});

export default tmdbAxios;
