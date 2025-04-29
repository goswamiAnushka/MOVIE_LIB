"use client";

import {
  Box,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
} from "@mui/material";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";
import { userLogout } from "@/Redux/Auth/user.slice";
import { publicRoutes } from "@/Routes/public.routes";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import ButtonField from "../UiComps/ButtonField";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const profileopen = Boolean(anchorEl);
  const id = profileopen ? "user-profile-popover" : undefined;

  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    setTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    );
  }, []);

  const dispatch = useDispatch();
  const cookies = new Cookies();

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };

  const gotoMovie = () => {
    router.push("/movies/list");
  };

  const gotoSearchMovie = () => {
    router.push("/movies/search");
  };

  useEffect(() => {
    if (!cookies.get("access_token")) {
      dispatch(userLogout());
    }
  }, [cookies, dispatch]);

  const handleLogout = () => {
    dispatch(userLogout());
    router.push("/");
  };

  const DrawerList = (
    <Box
      className="mobile-sidebar"
      sx={{ width: 302 }}
      role="presentation"
      onClick={() => {
        toggleDrawer(false);
      }}
    >
      <List className="menu-each-block">
        <p>MOVIES</p>
        <ListItemButton onClick={gotoMovie}>
          <ListItemIcon>
            {/* Add your SVG or icon */}
          </ListItemIcon>
          <ListItemText>Collection</ListItemText>
        </ListItemButton>
      </List>

      <Divider />

      <List className="menu-each-block">
        <p>SOCIAL</p>
        <ListItemButton>
          <ListItemIcon>
            <HomeOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Home</ListItemText>
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <ChatOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Messages</ListItemText>
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <NotificationsNoneOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Notifications</ListItemText>
        </ListItemButton>
      </List>

      <Divider />

      <List className="menu-each-block">
        <p>CREATE</p>
        <ListItemButton>
          <ListItemIcon>
            <AddPhotoAlternateOutlinedIcon />
          </ListItemIcon>
          <ListItemText>POST</ListItemText>
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <ChatOutlinedIcon />
          </ListItemIcon>
          <ListItemText>REVIEW</ListItemText>
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <PlaylistPlayOutlinedIcon />
          </ListItemIcon>
          <ListItemText>PLAYLIST</ListItemText>
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <div>
      {!publicRoutes.includes(pathname) && (
        <div>
          <Drawer
            open={open}
            onClose={() => {
              toggleDrawer(false);
            }}
          >
            {DrawerList}
          </Drawer>
          <Box className="header-wrap">
            <Container maxWidth={false}>
              <Box className="header-container">
                <IconButton
                  className="drawer-toggle"
                  onClick={() => toggleDrawer(true)}
                >
                  <MenuIcon />
                </IconButton>
                <Box className="header-title">My Application</Box>
                <IconButton onClick={handleClick}>
                  <Image src="/profile-icon.png" alt="Profile" width={40} height={40} />
                </IconButton>
                <Popover
                  id={id}
                  open={profileopen}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <List>
                    <ListItemButton>
                      <ListItemIcon>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText>Settings</ListItemText>
                    </ListItemButton>
                    <ListItemButton onClick={handleLogout}>
                      <ListItemIcon>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </ListItemButton>
                  </List>
                </Popover>
              </Box>
            </Container>
          </Box>
        </div>
      )}
    </div>
  );
};

export default Header;
