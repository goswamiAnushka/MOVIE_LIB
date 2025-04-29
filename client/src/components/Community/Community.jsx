import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar/Navbar';
import axiosCustom from "../../Services/AxiosConfig/axiosCustom";
import { Container, Typography, TextField, Button, Card, CardContent, CardMedia, Chip, IconButton, MenuItem, Select, FormControl, InputLabel, CircularProgress, Grid, Modal, Box, Divider } from '@mui/material';
import { AddPhotoAlternate, Edit, Delete, Save, Cancel, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import './Community.css';
import Sidebar from '../Sidebar/Sidebar';

const Community = () => {
  const [posts, setPosts] = useState([]);
  const [tags, setTags] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingPostId, setEditingPostId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [sortBy, sortOrder]);

  const fetchPosts = async () => {
    try {
      const response = await axiosCustom.get('/posts');
      const sortedPosts = sortPosts(response.data, sortBy, sortOrder);
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const sortPosts = (posts, sortBy, order) => {
    return [...posts].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortBy === 'title') {
        return order === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return 0;
    });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    try {
      const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error("Cloudinary upload failed");
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };

  const handleMediaChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsLoading(true);
      try {
        const uploadedUrl = await uploadToCloudinary(file);
        setMediaUrl(uploadedUrl);
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreateOrUpdatePost = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Title and content are required.");
      return;
    }
    setIsLoading(true);
    const userId = localStorage.getItem("userId");
    const postData = {
      title,
      content,
      tags: Array.isArray(tags) ? tags : [tags],
      mediaFile: mediaUrl,
      userId,
    };
    try {
      if (editingPostId) {
        await axiosCustom.put(`/posts/${editingPostId}`, postData);
      } else {
        await axiosCustom.post("/posts", postData);
      }
      fetchPosts();
      setEditingPostId(null);
      resetForm();
      setShowForm(false);
      setOpenModal(false);
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Failed to save post. Please try again")
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPost = (post) => {
    setEditingPostId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setTags(post.tags || []);
    setMediaUrl(post.mediaFile);
    setPreviewUrl(post.mediaFile);
    setOpenModal(true);
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    resetForm();
    setOpenModal(false);
  };

  const handleDeletePost = async (postId) => {
    try {
      await axiosCustom.delete(`/posts/${postId}`);
      setPosts(posts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setTags([]);
    setMediaFile(null);
    setPreviewUrl(null);
    setMediaUrl(null);
  };

  return (
    <>
      <Sidebar />
      <Navbar />
      <Container maxWidth="md" className="community-container">
        <div className="top-controls-container">
          <Button
            variant="contained"
            onClick={() => setShowForm(!showForm)}
            className="create-post-button"
            sx={{ 
              backgroundColor: '#7b1fa2', 
              '&:hover': { backgroundColor: '#6a1b9a' },
            }}
          >
            {showForm ? 'Cancel' : 'Write a Post'}
          </Button>
          
          <div className="sort-controls">
            <Typography variant="body1" sx={{ mr: 1 }}>Sort by:</Typography>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 1 }}>
              <Select
                value={sortBy}
                onChange={handleSortChange}
              >
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="title">Title</MenuItem>
              </Select>
            </FormControl>
            <IconButton onClick={toggleSortOrder} size="small">
              {sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
            </IconButton>
          </div>
        </div>
        {showForm && (
          <Card className="create-post-form" sx={{ mb: 3, mt: 2 }}>
            <CardContent>
              <Grid container spacing={2}>
                {/* Left Side: Media Upload */}
                <Grid item xs={12} sm={4}>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleMediaChange}
                    hidden
                    id="media-upload"
                  />
                  <label htmlFor="media-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      startIcon={<AddPhotoAlternate />}
                      sx={{ mb: 2 }}
                    >
                      Upload Media
                    </Button>
                  </label>
                  {previewUrl && (
                    <CardMedia
                      component="img"
                      className="form-media-preview"
                      image={previewUrl}
                      alt="Preview"
                      sx={{ borderRadius: 1 }}
                    />
                  )}
                </Grid>
                <Grid item xs={12} sm={8}>
                  <form onSubmit={handleCreateOrUpdatePost}>
                    <TextField
                      label="Title"
                      fullWidth
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      margin="normal"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Details"
                      fullWidth
                      multiline
                      rows={4}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      margin="normal"
                      sx={{ mb: 2 }}
                    />
                    <TextField
                      label="Add Tag"
                      fullWidth
                      margin="normal"

                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value.trim()) {
                          e.preventDefault();
                          setTags([...tags, e.target.value.trim()]);
                          e.target.value = '';
                        }
                      }}
                      sx={{ mb: 2 }}
                    />
                    <div className="post-tags">
                      {tags.map((tag, index) => (
                        <Chip key={index} label={tag} onDelete={() => setTags(tags.filter(t => t !== tag))} sx={{ mr: 1, mb: 1 }} />
                      ))}
                    </div>
                    <div className="post-actions">
                      <Button 
                        type="submit" 
                        variant="contained" 
                        className="submit-post-button"
                        startIcon={<Save />}
                        sx={{ 
                          mr: 2,
                          backgroundColor: '#7b1fa2',
                          '&:hover': { backgroundColor: '#6a1b9a' }
                        }}
                      >
                        Post
                      </Button>
                      <Button 
                        onClick={() => setShowForm(false)} 
                        variant="outlined" 
                        color="secondary"
                        startIcon={<Cancel />}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
        <Divider sx={{ my: 2 }} />
        {posts.map((post) => (
          <Card key={post._id} className="post-card" sx={{ mb: 2 }}>
            <Grid container>
              {post.mediaFile && (
                <Grid item xs={12} sm={4}>
                  <div className="post-media-container">
                    <CardMedia
                      component="img"
                      className="post-media"
                      image={post.mediaFile}
                      alt="Post Media"
                    />
                  </div>
                </Grid>
              )}
              <Grid item xs={12} sm={post.mediaFile ? 8 : 12}>
                <CardContent className="post-content">
                  <Typography variant="h6" className="post-title">{post.title}</Typography>
                  <Typography className="post-details">{post.content}</Typography>
                  <div className="post-tags">
                    {post.tags.map((tag, index) => (
                      <Chip key={index} label={tag} style={{ marginRight: '5px', marginBottom: '5px' }} />
                    ))}
                  </div>
                  <div className="post-actions">
                    <IconButton onClick={() => handleEditPost(post)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDeletePost(post._id)}>
                      <Delete />
                    </IconButton>
                  </div>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        ))}

        {/* Modal for Editing Post */}
        <Modal open={openModal} onClose={handleCancelEdit}>
          <Box className="modal-box">
            <Card className="post-card">
              <CardContent>
                <form onSubmit={handleCreateOrUpdatePost}>
                  <TextField
                    label="Title"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    margin="normal"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Details"
                    fullWidth
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    margin="normal"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    label="Add Tag"
                    fullWidth
                    margin="normal"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        e.preventDefault();
                        setTags([...tags, e.target.value.trim()]);
                        e.target.value = '';
                      }
                    }}
                    sx={{ mb: 2 }}
                  />
                  <div className="post-tags">
                    {tags.map((tag, index) => (
                      <Chip key={index} label={tag} onDelete={() => setTags(tags.filter(t => t !== tag))} sx={{ mr: 1, mb: 1 }} />
                    ))}
                  </div>
                  <input type="file" accept="image/*,video/*" onChange={handleMediaChange} hidden id="edit-media-upload" />
                  <label htmlFor="edit-media-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      fullWidth
                      startIcon={<AddPhotoAlternate />}
                      sx={{ mb: 2 }}
                    >
                      Change Media
                    </Button>
                  </label>
                  {previewUrl && (
                    <CardMedia
                      component="img"
                      className="form-media-preview"
                      image={previewUrl}
                      alt="Preview"
                      sx={{ borderRadius: 1, objectFit: 'contain' }} 
                    />
                  )}
                  <div className="post-actions">
                    <Button 
                      type="submit" 
                      variant="contained" 
                      className="submit-post-button"
                      startIcon={<Save />}
                      sx={{ 
                        mr: 2,
                        backgroundColor: '#7b1fa2',
                        '&:hover': { backgroundColor: '#6a1b9a' }
                      }}
                    >
                      Save
                    </Button>
                    <Button 
                      onClick={handleCancelEdit} 
                      variant="outlined" 
                      color="secondary"
                      startIcon={<Cancel />}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </Box>
        </Modal>
      </Container>
    </>
  );
};

export default Community;