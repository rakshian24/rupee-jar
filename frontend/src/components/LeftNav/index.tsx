import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import { APP_NAME, colors, ROUTES } from "../../constants";
import logo from "../../assets/pngs/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

const drawerWidth = 240;

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: ROUTES.DASHBOARD },
  { text: "Add Transaction", icon: <AddIcon />, path: ROUTES.ADD_TRANSACTION },
  {
    text: "Transaction History",
    icon: <HistoryIcon />,
    path: ROUTES.TRANSACTION_HISTORY,
  },
  { text: "Categories", icon: <CategoryIcon />, path: ROUTES.CATEGORIES },
  {
    text: "Reports & Analytics",
    icon: <BarChartIcon />,
    path: ROUTES.REPORTS,
  },
  { text: "Settings", icon: <SettingsIcon />, path: ROUTES.SETTINGS },
];

export const LeftNav = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar sx={{ px: "16px !Important" }}>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate(isLoggedIn ? ROUTES.DASHBOARD : ROUTES.LOGIN)}
        >
          <img src={logo} alt="logo" width={26} />
          <Typography fontWeight="500" color={colors.primary} fontSize={"20px"}>
            {APP_NAME}
          </Typography>
        </Box>
      </Toolbar>
      <List>
        {menuItems.map((item) => {
          const isSelected = currentPath === item.path;

          return (
            <ListItem
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                bgcolor: isSelected ? "#2AAC75" : "transparent",
                cursor: "pointer",
                color: isSelected ? "#fff" : "inherit",
                "& .MuiListItemIcon-root": {
                  color: isSelected ? "#fff" : "inherit",
                },
                "&:hover": {
                  bgcolor: isSelected ? "#2AAC75" : "rgba(0, 0, 0, 0.04)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "45px" }}>{item.icon}</ListItemIcon>
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
    </Drawer>
  );
};
