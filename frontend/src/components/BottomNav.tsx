import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import HistoryIcon from "@mui/icons-material/History";
import BarChartIcon from "@mui/icons-material/BarChart";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate, useLocation } from "react-router-dom";
import { colors, ROUTES } from "../constants";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const BottomNavigationActionStyles = {
    "&.Mui-selected": {
      color: colors.lightGreen,
      borderTop: `3px solid ${colors.lightGreen}`,
      mt: "-3px",
    },
  };

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        borderTop: "1px solid #ddd",
        paddingBottom: "env(safe-area-inset-bottom)",
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={currentPath}
        onChange={(_, newValue) => navigate(newValue)}
      >
        <BottomNavigationAction
          label="Home"
          value={ROUTES.DASHBOARD}
          icon={<HomeIcon />}
          sx={BottomNavigationActionStyles}
        />
        <BottomNavigationAction
          label="Add"
          value={ROUTES.ADD_TRANSACTION}
          icon={<AddIcon />}
          sx={BottomNavigationActionStyles}
        />
        <BottomNavigationAction
          label="History"
          value={ROUTES.TRANSACTION_HISTORY}
          icon={<HistoryIcon />}
          sx={BottomNavigationActionStyles}
        />
        <BottomNavigationAction
          label="Reports"
          value={ROUTES.REPORTS}
          icon={<BarChartIcon />}
          sx={BottomNavigationActionStyles}
        />
        <BottomNavigationAction
          label="Settings"
          value={ROUTES.SETTINGS}
          icon={<SettingsIcon />}
          sx={BottomNavigationActionStyles}
        />
      </BottomNavigation>
    </Paper>
  );
};
