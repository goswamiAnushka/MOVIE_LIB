const express = require("express");
const postController = require("../../controllers/post.controller");
const auth = require("../../middlewares/auth");
const router = express.Router();

// Fetch only the logged-in user's posts
router.get("/", auth(), postController.getUserPosts);
router.post("/", auth(), postController.createPost);
router.put("/:postId", auth(), postController.editPost);
router.delete("/:postId", auth(), postController.deletePost);

module.exports = router;
