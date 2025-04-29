const Post = require("../models/post.model");
const { uploadToCloudinary } = require("../services/post.service");


// Get all posts for the logged-in user
exports.getUserPosts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: Please log in to view your posts" });
    }

    const posts = await Post.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ error: "Error fetching user posts" });
  }
};
// Create a post (Only logged-in users)
exports.createPost = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized: Please log in to create a post" });
    }

    console.log("Request Body:", req.body);
    const { title, content, tags, mediaFile } = req.body;
    let mediaFileUrl = mediaFile || null;

    // Ensure tags is an array
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === "string" ? JSON.parse(tags) : tags;
      } catch (error) {
        console.error("Error parsing tags:", error);
        return res.status(400).json({ error: "Invalid tags format" });
      }
    }

    const newPost = new Post({
      title,
      content,
      tags: parsedTags,
      mediaFile: mediaFileUrl,
      userId: req.user.id, // Use logged-in user's ID
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
};

// Edit post (Only post owner can edit)
exports.editPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Ensure only the post owner can edit
    if (String(post.userId) !== String(req.user._id)) {
      console.warn("⚠️ Unauthorized edit attempt:", { user: req.user._id, postOwner: post.userId });
      return res.status(403).json({ error: "Unauthorized: You can only edit your own posts" });
    }

    const { title, content, tags } = req.body;
    let mediaFileUrl = req.body.mediaFile;

    if (req.file) {
      const uploadedMedia = await uploadToCloudinary(req.file.path);
      mediaFileUrl = uploadedMedia.url;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      { 
        title, 
        content, 
        tags: Array.isArray(tags) ? tags : tags ? JSON.parse(tags) : [], 
        mediaFile: mediaFileUrl 
      },
      { new: true }
    );

    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ error: "Error updating post" });
  }
};

// Delete post (Only post owner can delete)
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Ensure only the post owner can delete
    if (String(post.userId) !== String(req.user.id)) {
      return res.status(403).json({ error: "Unauthorized: You can only delete your own posts" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Error deleting post" });
  }
};
