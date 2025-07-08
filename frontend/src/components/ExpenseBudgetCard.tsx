import React from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  LinearProgress,
  useTheme,
} from "@mui/material";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import { colors, INDIAN_RUPEE_SYMBOL } from "../constants";

interface BudgetCardProps {
  title: string;
  frequency?: string;
  budget: number;
  spent: number;
  icon?: React.ReactNode;
  color?: string;
  onClick: () => void;
  isSelected: boolean;
}

const ExpenseBudgetCard: React.FC<BudgetCardProps> = ({
  title,
  frequency = "Monthly",
  budget,
  spent,
  icon = <RestaurantIcon />,
  color = "#EF4444", // red
  onClick,
  isSelected,
}) => {
  const theme = useTheme();
  const percentage = Math.min(Math.round((spent / budget) * 100), 100);

  return (
    <Paper
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        borderRadius: 3,
        border: isSelected ? `2px solid ${color}` : "none",
        backgroundColor: colors.lightRed1,
        minWidth: 300,
        boxShadow: "none",
        cursor: "pointer",
      }}
    >
      <Box display="flex" alignItems="center" gap={2} flex={1}>
        <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>{icon}</Avatar>

        <Box width="100%">
          <Box display="flex" justifyContent="space-between">
            <Typography fontWeight={600}>{title}</Typography>
            <Typography color="text.secondary" fontSize={13}>
              {frequency}
            </Typography>
          </Box>

          <Typography fontSize={13}>
            Budget: {INDIAN_RUPEE_SYMBOL}
            {budget}
          </Typography>

          <Box mt={1}>
            <LinearProgress
              variant="determinate"
              value={percentage}
              sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: `${theme.palette.grey[300]}`,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: color,
                },
              }}
            />
            <Typography
              variant="caption"
              mt={0.5}
              color={color}
              display="block"
              fontWeight={500}
            >
              Spent: {INDIAN_RUPEE_SYMBOL}
              {spent} / {INDIAN_RUPEE_SYMBOL}
              {budget} ({percentage}%)
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default ExpenseBudgetCard;
