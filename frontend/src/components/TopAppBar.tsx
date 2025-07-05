import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  useMediaQuery,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { screenSize, colors, APP_NAME } from "../constants";
import logo from "../assets/pngs/logo.png";
import useMenuItemsList from "../hooks/useMenuItems";

export const TopAppBar = () => {
  const menuItems = useMenuItemsList();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const currentMenu = menuItems.find((item) => item.path === currentPath);
  const currentPageTitle = currentMenu?.text || "Dashboard";

  if (!isTablet) return null;

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#fff", color: "#000", boxShadow: "none" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton onClick={() => setDrawerOpen(true)}>
            <MenuIcon sx={{ color: colors.lightGreen }} />
          </IconButton>
          <Typography fontWeight={600} sx={{ color: colors.lightGreen }}>
            {currentPageTitle}
          </Typography>
          <IconButton>
            <NotificationsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setDrawerOpen(false)}
        >
          <List sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" gap={1}>
              <img src={logo} alt="logo" width={28} />
              <Typography
                fontWeight="500"
                color={colors.primary}
                fontSize={"20px"}
              >
                {APP_NAME}
              </Typography>
            </Box>
          </List>
          <List>
            {menuItems.map((item) => {
              const isSelected = currentPath === item.path;
              return (
                <ListItem
                  button
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    bgcolor: isSelected ? "#2AAC75" : "transparent",
                    color: isSelected ? "#fff" : "inherit",
                    "& .MuiListItemIcon-root": {
                      color: isSelected ? "#fff" : "inherit",
                    },
                    "&:hover": {
                      bgcolor: isSelected ? "#2AAC75" : "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "35px" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
