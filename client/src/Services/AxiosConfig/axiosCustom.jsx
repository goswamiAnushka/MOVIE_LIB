import axios from "axios";
import Cookies from "universal-cookie";
import store from "../../redux/store";
import { userLogout } from "../../redux/Auth/user.slice";

export const SERVER_URL = "http://localhost:3000";
const cookies = new Cookies();
const axiosCustom = axios.create({
  baseURL: `${SERVER_URL}/v1/`,
  headers: { "Content-Type": "application/json" },
});
let isRefreshing = false;
let failedRequestsQueue = [];

// Function to process the queue after token refresh
const processQueue = (error, token = null) => {
  failedRequestsQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedRequestsQueue = [];
};

// Function to logout user & redirect
const logoutUser = () => {
  console.warn("Logging out user due to expired refresh token.");
  store.dispatch(userLogout());
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  cookies.remove("access_token", { path: "/" });
  cookies.remove("refresh_token", { path: "/" });
  window.location.href = "/login";
};

// Request Interceptor: Attach Access Token
axiosCustom.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry
axiosCustom.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If Unauthorized (401) and request has not been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Add the failed request to the queue
        return new Promise((resolve, reject) => {
          failedRequestsQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosCustom(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
          logoutUser();
          return Promise.reject(new Error("No refresh token available"));
        }

        // Request new access token
        console.log("Attempting to refresh access token...");
        const response = await axiosCustom.post("/auth/refresh-tokens", { refreshToken });
        const { accessToken } = response.data;

        // Store new access token
        localStorage.setItem("access_token", accessToken);

        // Update request header & retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        // Process the queue with the new token
        processQueue(null, accessToken);

        console.log("Retrying original request with new access token...");
        return axiosCustom(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        // Process the queue with the error
        processQueue(refreshError);

        // Logout if refresh token is invalid/expired
        logoutUser();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);
export default axiosCustom;
