const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const { Blob } = require("buffer"); // Import Blob from the buffer module



const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const reviewRoute = require("./review.route");
const postRoute = require("./post.route");
const likeRoute = require("./like.route");
const playlistRoute = require("./playlist.route"); // Import the new playlist route

dotenv.config();
const router = express.Router();
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

const defaultRoutes = [
  { path: "/auth", route: authRoute },
  { path: "/users", route: userRoute },
  { path: "/reviews", route: reviewRoute },
  { path: "/posts", route: postRoute },
  { path: "/like", route: likeRoute },
  { path: "/playlist", route: playlistRoute }, // Add the new playlist route
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.post("/upload/image", async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });

    const imageBlob = new Blob([imageResponse.data], { type: "image/jpeg" });

    // Prepare form data for Cloudinary
    const formData = new FormData();
    formData.append("file", imageBlob, "tmdb_image.jpg"); 
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("api_key", CLOUDINARY_API_KEY);

    // Upload to Cloudinary
    const cloudinaryResponse = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } } 
    );
    return res.json({ secure_url: cloudinaryResponse.data.secure_url });
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error.response?.data || error.message);
    return res.status(500).json({ message: "Failed to upload image" });
  }
});
module.exports = router;
