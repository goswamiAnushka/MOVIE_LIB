import React, { useEffect, useState } from "react";
import axiosCustom from "../../Services/AxiosConfig/axiosCustom";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import "./playlistList.css";

const PlaylistList = () => {
  const [playlists, setPlaylists] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [deletedPlaylistId, setDeletedPlaylistId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const response = await axiosCustom.get(`/playlist?page=${page}&limit=6`);
      if (response.data.length > 0) {
        setPlaylists((prev) => [...prev, ...response.data]);
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (playlistId) => {
    try {
      await axiosCustom.delete(`/playlist/${playlistId}`);
      setDeletedPlaylistId(playlistId);
      setDialogMessage("Playlist deleted successfully!");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      setDialogMessage("Failed to delete playlist. Please try again.");
    }
    setDialogOpen(true);
  };

  const handleCardClick = (playlistId) => {
    navigate(`/playlist/${playlistId}`);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100
    ) {
      fetchPlaylists();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (deletedPlaylistId) {
      setPlaylists((prev) => prev.filter((playlist) => playlist._id !== deletedPlaylistId));
      setDeletedPlaylistId(null);
    }
  };

  return (
    <div className="playlist-list">
      <Navbar />
      <Container>
        <Typography variant="h4" gutterBottom>
          Your Playlists
        </Typography>
        <Grid container spacing={3}>
          {playlists.map((playlist) => (
            <Grid item key={playlist._id} xs={12} sm={6} md={4}>
              <Card className="playlist-card" onClick={() => handleCardClick(playlist._id)}>
                <CardMedia
                  component="img"
                  className="playlist-thumbnail"
                  image={playlist.thumbnail}
                  alt={playlist.playlistTitle}
                />
                <CardContent className="playlist-content">
                  <Typography variant="h6" className="playlist-title">{playlist.playlistTitle}</Typography>
                  <Typography variant="body2" color="text.secondary" className="playlist-description">
                    {playlist.description}
                  </Typography>
                </CardContent>
                <CardActions className="playlist-actions">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(playlist._id);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        {loading && <CircularProgress style={{ display: "block", margin: "20px auto" }} />}
        {!hasMore && playlists.length > 0 && (
          <Typography variant="body1" align="center">
            No more playlists to load.
          </Typography>
        )}
      </Container>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Message</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PlaylistList;