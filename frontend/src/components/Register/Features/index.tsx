import { FaChartPie } from "react-icons/fa";
import { IoWallet } from "react-icons/io5";
import { Box, Grid, Typography } from "@mui/material";
import { IoShieldHalfOutline } from "react-icons/io5";
import { BsGraphUp } from "react-icons/bs";
import { colors } from "../../../constants";

const features = [
  {
    icon: <BsGraphUp color={colors.primary} fontSize={28} />,
    title: "Free expense tracking",
    description: "Track all your expenses in one place without any cost",
  },
  {
    icon: <FaChartPie color={colors.primary} fontSize={28} />,
    title: "Detailed analytics",
    description: "Visualize your spending habits with intuitive charts",
  },
  {
    icon: <IoWallet color={colors.primary} fontSize={28} />,
    title: "Budget management",
    description: "Set and track budgets to reach your financial goals",
  },
  {
    icon: <IoShieldHalfOutline color={colors.primary} fontSize={28} />,
    title: "Secure data storage",
    description: "Your financial data is encrypted and secure",
  },
];

const Features = () => {
  return (
    <Grid container spacing={4}>
      {features.map((feature, index) => (
        <Grid item xs={12} sm={6} key={index}>
          <Box display="flex" gap={2}>
            {feature.icon}
            <Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                textAlign={"left"}
              >
                {feature.title}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign={"left"}
              >
                {feature.description}
              </Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default Features;
