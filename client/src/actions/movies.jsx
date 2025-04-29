import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_TMDB_URL,
  headers: {
    Authorization: `${process.env.NEXT_PUBLIC_TMDB_TOKEN}`,
  },
});

// Movie API calls
export const getPopularMovies = async (query) => {
  const { data } = await axiosInstance.get(`/movie/popular?${query || ""}`);
  return data;
};

export const getTopRatedMovies = async (query) => {
  const { data } = await axiosInstance.get(`/movie/top_rated?${query || ""}`);
  return data;
};

export const getUpcomingMovies = async (query) => {
  const { data } = await axiosInstance.get(`/movie/upcoming?${query || ""}`);
  return data;
};

