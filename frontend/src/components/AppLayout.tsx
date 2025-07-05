import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { LeftNav } from "../components/LeftNav";
import { colors, screenSize } from "../constants";

export const AppLayout = () => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <LeftNav />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: colors.grey1,
          p: isTablet ? 2 : 3,
          height: "calc(100vh - 96px)",
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};
