import { Box, Stack, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ReactComponent as Flagman } from "../../assets/svgs/flagman.svg";
import { colors, screenSize } from "../../constants";
import logo from "../../assets/pngs/logo-with-text.png";

const Home = () => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  return (
    <Stack direction={"row"} height={"100%"}>
      {!isTablet && (
        <Stack width={"50%"} px={6} py={3} bgcolor={colors.lightGrey}>
          <Box>
            <img src={logo} width={150} alt="logo" />
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"100%"}
          >
            <Flagman width="100%" height={"500px"} />
          </Box>
        </Stack>
      )}
      <Stack
        width={isTablet ? "100%" : "50%"}
        height={"100%"}
        pl={isTablet ? 3 : 10}
        pr={isTablet ? 3 : 20}
        display={"flex"}
        justifyContent={isTablet ? "flex-start" : "center"}
      >
        <Stack py={isTablet ? 0 : 7.5} maxWidth={"768px"}>
          {isTablet && (
            <Stack
              mt={4}
              justifyContent={"center"}
              display={"flex"}
              alignItems={"center"}
            >
              <img src={logo} width={150} alt="logo" />
            </Stack>
          )}
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
