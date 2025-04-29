
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "universal-cookie";

// Initialize cookies instance
const cookies = new Cookies();

// Load user from localStorage safely
const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing stored user data:", error);
    return null;
  }
};

const initialState = {
  user: getStoredUser(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserData: (state, action) => {
      console.log("Updating Redux state with user:", action.payload); 
      state.user = action.payload;

      if (action.payload) {
        localStorage.setItem("user", JSON.stringify(action.payload));
      } else {
        localStorage.removeItem("user");
      }
    },

    userLogout: (state) => {
      console.log("Logging out user"); // Debug log

      // Reset Redux state
      state.user = null;

      // Clear user data from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Remove cookies
      cookies.remove("access_token", { path: "/" });
      cookies.remove("refresh_token", { path: "/" });

      console.log("User successfully logged out.");
    },
  },
});

export const { updateUserData, userLogout } = userSlice.actions;
export default userSlice.reducer;
