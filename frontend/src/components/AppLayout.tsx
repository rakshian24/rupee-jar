import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { LeftNav } from "../components/LeftNav";
import { colors, screenSize } from "../constants";
import { TopAppBar } from "./TopAppBar";
import { BottomNav } from "./BottomNav";

export const AppLayout = () => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        flexDirection: isTablet ? "column" : "row",
      }}
    >
      {!isTablet && <LeftNav />}

      {isTablet && <TopAppBar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: colors.grey1,
          p: isTablet ? 2 : 3,
          height: !isTablet ? "calc(100vh - 120px)" : "100vh",
          overflowY: "auto",
          mb: isTablet ? "56px" : "0px",
        }}
      >
        <Outlet />
      </Box>

      {isTablet && <BottomNav />}
    </Box>
  );
};
