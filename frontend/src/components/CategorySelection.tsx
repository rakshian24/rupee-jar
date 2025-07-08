import { Avatar, Box, Grid, Stack, Typography } from "@mui/material";
import { ExpenseCategory, IncomeCategory } from "../types";
import { colors } from "../constants";
import ExpenseBudgetCard from "./ExpenseBudgetCard";

type Props = {
  incomeCategories: IncomeCategory[] | [];
  expenseCategories: ExpenseCategory[] | [];
  isSelectedTypeIncome: boolean;
  handleSelectedCategory: (id: string) => void;
  selectedCategoryId: string;
};

const CategorySelection = ({
  incomeCategories,
  expenseCategories,
  isSelectedTypeIncome,
  handleSelectedCategory,
  selectedCategoryId,
}: Props) => {
  return (
    <Box maxHeight={"280px"} sx={{ overflowY: "scroll" }}>
      {isSelectedTypeIncome ? (
        <Grid container spacing={2}>
          {incomeCategories.map((category: IncomeCategory) => (
            <Grid item xs={4} key={category._id}>
              <Box
                onClick={() => handleSelectedCategory(category._id)}
                sx={{
                  bgcolor: "#D1FAE5",
                  border:
                    selectedCategoryId === category._id
                      ? "2px solid #059669"
                      : "2px solid transparent",
                  borderRadius: 3,
                  height: 100,
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  gap: 1,
                  transition: "0.2s",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#0DB981",
                    color: "white",
                    width: 40,
                    height: 40,
                  }}
                >
                  {category.icon}
                </Avatar>
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.black,
                    fontWeight: 500,
                  }}
                >
                  {category.name}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Stack gap={2}>
          <Grid container spacing={2}>
            {expenseCategories.map((expenseCat: ExpenseCategory) => {
              const { category, budget, spent } = expenseCat;
              return (
                <Grid item md={6} sm={12} xs={12} key={category._id}>
                  <ExpenseBudgetCard
                    key={category._id}
                    title={category.name}
                    budget={budget.limit}
                    spent={spent}
                    onClick={() => handleSelectedCategory(category._id)}
                    isSelected={selectedCategoryId === category._id}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Stack>
      )}
    </Box>
  );
};

export default CategorySelection;
