import { Stack, Typography, useMediaQuery } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import { APP_NAME, colors, ROUTES, screenSize } from "../../constants";
import happyPig from "../../assets/pngs/happy-pig.png";
import Features from "../../components/Register/Features";

const Home = () => {
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const { pathname } = useLocation();
  const isCurrentPathLogin = pathname === ROUTES.LOGIN;

  return (
    <Stack direction={"row"} height={"100%"} mb={isTablet ? 10 : 0}>
      {!isTablet && (
        <Stack width={"65%"} px={6} py={3} bgcolor={colors.lightGrey}>
          <Stack gap={6}>
            <Stack gap={2} justifyContent={"center"} alignItems={"center"}>
              <img src={happyPig} alt="happy-pig" width={300} />
              <Stack gap={0.5} textAlign={"center"}>
                <Typography
                  fontWeight={600}
                  fontSize={"28px"}
                  color={colors.primary}
                >
                  {isCurrentPathLogin
                    ? `Welcome to ${APP_NAME}`
                    : `Join ${APP_NAME} today`}
                </Typography>
                <Typography fontSize={"16px"} color={colors.contentSecondary}>
                  {isCurrentPathLogin
                    ? "Your personal finance companion"
                    : "Take control of your finances"}
                </Typography>
              </Stack>
            </Stack>
            <Features />
          </Stack>
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
              <img src={happyPig} width={150} alt="logo" />
            </Stack>
          )}
          <Outlet />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default Home;
