import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { TextField, Button, Rating, Box, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Navbar from "../Navbar/Navbar";
import axiosCustom from "../../Services/AxiosConfig/axiosCustom";
import { useSelector } from "react-redux";
import "./WriteReviewPage.css";
import Sidebar from "../Sidebar/Sidebar";
const EditReviewPage = () => {
  const { state } = useLocation();
  const { reviewId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  
  const [review, setReview] = useState(state?.review || { tags: [] });  // Ensure tags is initialized
  const [tagInput, setTagInput] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    // If review is not passed via state, fetch it from the API
    if (!state?.review) {
      const fetchReview = async () => {
        try {
          const response = await axiosCustom.get(`/reviews/${reviewId}`);
          setReview(response.data.review);
        } catch (error) {
          console.error("Error fetching review:", error);
        }
      };
      fetchReview();
    }
  }, [state?.review, reviewId]);

  const handleChange = (field, value) => {
    if (field.includes("Score")) {
      const numericValue = Math.min(10, Math.max(0, Number(value)));
      setReview((prev) => ({ ...prev, [field]: numericValue }));
    } else {
      setReview((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !review.tags.includes(trimmedTag)) {
      setReview((prev) => ({ ...prev, tags: [...prev.tags, trimmedTag] }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag) => {
    setReview((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  const handleUpdateReview = async () => {
    try {
      const response = await axiosCustom.put(`/reviews/${reviewId}`, review);
      if (response.status === 200) {
        setDialogOpen(true);
      }
    } catch (error) {
      console.error("Error updating review:", error);
      setDialogOpen(true);
    }
  };

  if (!review) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <Sidebar/>
      <div className="write-review-wrapper">
        <div className="review-page-container">
          <div className="review-page">
            <h2 className="review-header">Edit Your Review</h2>
            <div className="review-container">
              <div className="poster-box">
                <img
                  src={`https://image.tmdb.org/t/p/w500${state?.movie?.poster_path || review.moviePoster}`}
                  alt={state?.movie?.title || review.movieTitle}
                  className="review-poster"
                />
              </div>
              <div className="details-box">
                <div className="field-group">
                  <label className="field-label">Movie Name</label>
                  <TextField fullWidth variant="outlined" value={state?.movie?.title || review.movieTitle} disabled />
                </div>
                <div className="field-group">
                  <label className="field-label">Review Title</label>
                  <TextField fullWidth variant="outlined" value={review.review_title} onChange={(e) => handleChange("review_title", e.target.value)} />
                </div>
                <div className="field-group">
                  <label className="field-label">Review</label>
                  <TextField fullWidth multiline rows={4} variant="outlined" value={review.review_details} onChange={(e) => handleChange("review_details", e.target.value)} />
                </div>
                <div className="field-group">
                  <label className="field-label">Add Tags</label>
                  <Box className="tag-input-box">
                    <TextField 
                      fullWidth 
                      variant="outlined" 
                      placeholder="Type tag and press +" 
                      value={tagInput} 
                      onChange={(e) => setTagInput(e.target.value)} 
                      onKeyPress={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }} 
                    />
                    <IconButton onClick={handleAddTag}><AddIcon /></IconButton>
                  </Box>
                  <Box>
                    {Array.isArray(review.tags) && review.tags.length > 0 ? (
                      review.tags.map((tag, index) => (
                        <Chip key={index} label={tag} onDelete={() => handleRemoveTag(tag)} />
                      ))
                    ) : (
                      <p>No tags available</p>
                    )}
                  </Box>
                </div>
              </div>
            </div>
            <Box className="rating-section">
              <h3 className="rating-header">General Score</h3>
              <Rating value={review.generalScore} max={10} precision={0.5} onChange={(e, newValue) => handleChange("generalScore", newValue || 0)} />
            </Box>
            <Box className="rating-grid">
              {["plotScore", "storyScore", "characterScore", "cinematographyScore", "rateScore"].map((key) => (
                <div key={key} className="rating-box">
                  <p className="rating-label">{key.replace("Score", "")}</p>
                  <TextField fullWidth variant="outlined" type="number" placeholder="0-10" value={review[key]} onChange={(e) => handleChange(key, e.target.value)} inputProps={{ min: 0, max: 10, step: 0.5 }} />
                </div>
              ))}
            </Box>
            <Box className="button-container">
              <Button variant="contained" onClick={() => navigate(-1)}>Cancel</Button>
              <Button variant="contained" onClick={handleUpdateReview}>Update</Button>
            </Box>
          </div>
        </div>
      </div>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Review Update</DialogTitle>
        <DialogContent>{user ? "Review updated successfully!" : "User not found! Please log in."}</DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); if (user) navigate(-1); }}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
 
export default EditReviewPage;
