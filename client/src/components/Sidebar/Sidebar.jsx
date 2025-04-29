import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Typography,
} from "@mui/material";
import { Home, Public } from "@mui/icons-material";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const houses = [
    { name: "STAR WARS", icon: "🚀" },
    { name: "HARRY POTTER", icon: "🧙" },
    { name: "TARANTINO FANS", icon: "🎥" },
    { name: "THE BOYS", icon: "🔥" },
  ];

  const friends = [
    { name: "graveyard", avatar: "👻", online: true },
    { name: "Mike_Nevora", avatar: "👨", online: false },
    { name: "Jess_whatever", avatar: "👩", online: false },
  ];

  return (
    <Drawer variant="permanent" className="sidebar">
      {/* Navigation */}
      <List>
        <ListItem component={Link} to="/community" className="nav-item">
          <ListItemIcon>
            <Home className="nav-icon" />
          </ListItemIcon>
          <ListItemText primary="My Feed" />
        </ListItem>
        <ListItem component={Link} to="/list" className="nav-item">
          <ListItemIcon>
            <Public className="nav-icon" />
          </ListItemIcon>
          <ListItemText primary="Explore" />
        </ListItem>
      </List>

      <Divider />

      {/* Houses Section */}
      <Typography variant="body2" className="section-title">
        YOUR HOUSES
      </Typography>
      <List>
        {houses.map((house) => (
          <ListItem button key={house.name} className="nav-item">
            <ListItemIcon>{house.icon}</ListItemIcon>
            <ListItemText primary={house.name} />
          </ListItem>
        ))}
      </List>

      <Divider />

      {/* Friends Online Section */}
      <Typography variant="body2" className="section-title">
        FRIENDS ONLINE
      </Typography>
      <List>
        {friends.map((friend) => (
          <ListItem button key={friend.name} className="nav-item">
            <ListItemIcon>
              <Avatar className={`friend-avatar ${friend.online ? "online" : "offline"}`}>
                {friend.avatar}
              </Avatar>
            </ListItemIcon>
            <ListItemText primary={friend.name} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;