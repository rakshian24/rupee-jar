import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Typography,
  Stack,
  Paper,
  Divider,
  useMediaQuery,
  SelectChangeEvent,
} from "@mui/material";

import { colors, ROUTES, screenSize } from "../../constants";
import CustomSegmentedToggle, {
  CustomSegmentedToggleOption,
} from "../../components/CustomSegmentedToggle";
import { Account, PaymentMethod, TransactionType } from "../../types";
import {
  IAddTransactionFormValueTypes,
  InitialAddTrasactionFormValues,
} from "./helpers";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_TRANSACTION } from "../../graphql/mutations";
import { Controller, useForm } from "react-hook-form";
import { CustomInputField } from "../../components/CustomInputField";
import { FaRupeeSign } from "react-icons/fa";
import CustomSelect from "../../components/CustomSelect";
import {
  GET_ALL_EXPENSE_CATEGORIES,
  GET_ALL_INCOME_CATEGORIES,
  GET_ME,
} from "../../graphql/queries";
import CustomDatePicker from "../../components/CustomDatePicker";
import dayjs from "dayjs";
import {
  capitalizeFirstLetter,
  formatNumber,
  getCategoryName,
  Windows1252Regex,
} from "../../utils";
import Button from "../../components/CustomButton";
import ErrorBox from "../../components/ErrorBox";
import { useNavigate } from "react-router-dom";
import CategorySelection from "../../components/CategorySelection";

const AddTransactionDesktop: React.FC = () => {
  const { data: userData, loading: isMeLoading, refetch } = useQuery(GET_ME);
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const navigate = useNavigate();

  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION);

  const { data: incomeCategoriesData, loading: isIncomeCategoriesLoading } =
    useQuery(GET_ALL_INCOME_CATEGORIES);

  const { data: expenseCategoriesData, loading: isExpenseCategoriesLoading } =
    useQuery(GET_ALL_EXPENSE_CATEGORIES);

  const incomeCategories = incomeCategoriesData?.getAllIncomeCategories || [];
  const expenseCategories =
    expenseCategoriesData?.getAllExpenseCategories || [];

  const { control, formState, handleSubmit, watch } = useForm({
    defaultValues: { ...InitialAddTrasactionFormValues },
    mode: "onChange",
  });

  const { errors } = formState;
  const COMMON_PROPS = { control: control, errors: errors };
  const isFormDisabled = !formState.isValid;

  const amount = Number(watch("amount") || 0);
  const date = watch("date");
  const description = watch("description");
  const accountId = watch("accountId");

  const accounts = userData?.me?.accounts || [];

  useEffect(() => {
    if (accountId && accounts.length > 0) {
      const selected =
        accounts.find((acc: Account) => acc._id === accountId) || null;
      setCurrentAccount(selected);
    } else {
      setCurrentAccount(null);
    }
  }, [accountId, accounts]);

  if (isMeLoading) {
    return <p>Loading</p>;
  }

  const onSubmitHandler = async (formValues: IAddTransactionFormValueTypes) => {
    const { data } = await createTransaction({
      variables: {
        input: {
          ...formValues,
          userId: userData?.me?._id,
          categoryId: selectedCategoryId,
          date: dayjs(formValues.date).format("YYYY-MM-DD"),
          type,
        },
      },
    });
    if (data?.createTransaction?._id) {
      refetch();
      navigate(ROUTES.DASHBOARD);
    }
  };

  const isSelectedTypeIncome = type === TransactionType.INCOME;

  const balance = currentAccount?.balance || 0;
  const newBalance = isSelectedTypeIncome ? balance + amount : balance - amount;

  const toggleOptions: CustomSegmentedToggleOption<
    TransactionType.INCOME | TransactionType.EXPENSE
  >[] = [
    {
      label: "Income",
      value: TransactionType.INCOME,
      bgColor: colors.lightGreen,
      textColor: colors.white,
    },
    {
      label: "Expense",
      value: TransactionType.EXPENSE,
      bgColor: colors.lightRed,
      textColor: colors.red,
    },
  ];

  if (isIncomeCategoriesLoading || isExpenseCategoriesLoading) {
    return <p>Loading</p>;
  }

  return (
    <Box
      p={4}
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      borderRadius={"20px"}
    >
      {/* Left Form Section */}
      <Box
        flex={3}
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmitHandler)}
        bgcolor={colors.white}
        p={4}
        sx={{
          borderTopLeftRadius: "20px",
          borderBottomLeftRadius: "20px",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Typography variant="h5">New Transaction</Typography>
          <Box display="flex" borderRadius={5} p={0.5}>
            <CustomSegmentedToggle
              options={toggleOptions}
              selected={type}
              onChange={(newValue: TransactionType) => {
                if (newValue !== type) {
                  setType(newValue);
                }
              }}
              sx={{ flex: 1 }}
              thumbColor={colors.grey1}
              bgColor={colors.lightGreen}
              wrapperSx={{ width: isTablet ? "100%" : "auto" }}
            />
          </Box>
        </Box>
        <Stack gap={isTablet ? 2 : 3}>
          <Controller
            name="accountId"
            {...COMMON_PROPS}
            rules={{
              required: true,
            }}
            render={({ field, fieldState: { error } }) => (
              <CustomSelect
                {...field}
                error={error !== undefined}
                styles={{ width: "100%" }}
                placeholder={"Select account"}
                label={"Account"}
                defaultValue={field.value}
                onChange={(e: SelectChangeEvent<unknown>) => {
                  field.onChange(e.target.value);
                }}
              >
                {accounts.map((account: Account) => (
                  <MenuItem key={account._id} value={account._id}>
                    {account.bankName}
                  </MenuItem>
                ))}
              </CustomSelect>
            )}
          />
          <Controller
            name="amount"
            {...COMMON_PROPS}
            rules={{
              required: "Transaction amount is required",
              min: {
                value: 1,
                message: "Transaction amount must be greater than 0",
              },
              validate: (value) => {
                const numericValue = Number(value);
                if (value.toString().length > 8) {
                  return "Amount cannot exceed 8 digits";
                }
                if (
                  !isSelectedTypeIncome &&
                  numericValue > (currentAccount?.balance || 0)
                ) {
                  return "Transaction amount cannot be greater than current balance";
                }
                return true;
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <CustomInputField
                {...field}
                type="number"
                onChange={(e) => {
                  let inputValue = e.target.value.replace(/^0+(?!\.)/, "");

                  // Handle edge cases: empty string, dot-only input, and leading dot
                  if (!inputValue || inputValue === ".") {
                    inputValue = "0";
                  } else if (inputValue.startsWith(".")) {
                    inputValue = `0${inputValue}`;
                  }

                  const digitsOnly = inputValue.replace(".", "");
                  if (digitsOnly.length > 8) return;

                  field.onChange(inputValue);
                }}
                sx={{ width: "100%" }}
                placeholder={"Enter transaction amount"}
                label={"Transaction amount"}
                error={error !== undefined}
                startIcon={<FaRupeeSign />}
              />
            )}
          />

          <Stack gap={1}>
            <Typography
              sx={{
                px: 2,
                color: colors.contentSecondary,
                fontSize: "12px",
              }}
            >
              Category
            </Typography>
            <CategorySelection
              incomeCategories={incomeCategories}
              expenseCategories={expenseCategories}
              isSelectedTypeIncome={isSelectedTypeIncome}
              handleSelectedCategory={(id: string) => setSelectedCategoryId(id)}
              selectedCategoryId={selectedCategoryId}
            />
          </Stack>

          <Controller
            name="paymentMethod"
            {...COMMON_PROPS}
            rules={{
              required: true,
            }}
            render={({ field, fieldState: { error } }) => (
              <CustomSelect
                {...field}
                error={error !== undefined}
                styles={{ width: "100%" }}
                placeholder={"Select payment method"}
                label={"Payment method"}
                defaultValue={field.value}
                onChange={(e: SelectChangeEvent<unknown>) => {
                  field.onChange(e.target.value);
                }}
              >
                {Object.values(PaymentMethod).map((paymentMethod) => (
                  <MenuItem key={paymentMethod} value={paymentMethod}>
                    {paymentMethod === PaymentMethod.CASH
                      ? "Cash"
                      : paymentMethod}
                  </MenuItem>
                ))}
              </CustomSelect>
            )}
          />

          <Controller
            name="date"
            rules={{ required: "Transaction date is required" }}
            control={control}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <CustomDatePicker
                value={value ? dayjs(value) : null}
                error={!!error}
                styles={{ width: "100%" }}
                onChange={(newValue) => onChange(newValue)}
                placeholder={"Enter transaction date"}
                label={"Transaction date"}
              />
            )}
          />

          <Controller
            name="description"
            {...COMMON_PROPS}
            rules={{
              required: "Transaction description is required",
              pattern: {
                value: Windows1252Regex,
                message: "Invalid characters",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <CustomInputField
                {...field}
                multiline
                rows={6}
                placeholder={"Add notes about this transaction..."}
                label={"Description"}
                error={error !== undefined}
                styles={{ width: "100%" }}
              />
            )}
          />
        </Stack>

        <ErrorBox formState={formState} style={{ my: 2 }} />

        <Box mt={4} display="flex" justifyContent="flex-end" gap={2}>
          <Button
            buttonText="Cancel"
            priority="tertiary"
            onClick={() => navigate(ROUTES.DASHBOARD)}
            type="button"
          />
          <Button
            buttonText="Save & Add Another"
            priority="secondary"
            disabled={isFormDisabled}
          ></Button>
          <Button
            buttonText="Save Transaction"
            disabled={isFormDisabled}
          ></Button>
        </Box>
      </Box>

      {/* Right Preview Section */}
      <Box flex={2} bgcolor={"#F9FAFB"} p={4}>
        <Typography variant="h6" mb={2}>
          Transaction Preview
        </Typography>
        <Paper
          elevation={1}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            boxShadow:
              "0 2px 4px rgba(15, 23, 142, 0.06), 0 6px 20px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1" color={colors.contentSecondary}>
              Current Balance
            </Typography>
            <Typography variant="body1" color={colors.contentSecondary}>
              {currentAccount?.bankName || "Account not selected"}
            </Typography>
          </Box>
          <Typography variant="h4" mt={2} mb={2.25}>
            &#8377;{formatNumber(balance, false)}
          </Typography>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1" color={colors.contentSecondary}>
              Transaction Amount
            </Typography>
            <Typography
              variant="body1"
              color={isSelectedTypeIncome ? "success.main" : "error.main"}
            >
              {isSelectedTypeIncome
                ? `+ ₹${formatNumber(amount, false)}`
                : `- ₹${formatNumber(amount, false)}`}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1" color={colors.contentSecondary}>
              New Balance
            </Typography>
            <Typography variant="h6">
              &#8377;{formatNumber(newBalance, false)}
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={1}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            boxShadow:
              "0 2px 4px rgba(15, 23, 142, 0.06), 0 6px 20px rgba(15, 23, 42, 0.06)",
          }}
        >
          <Typography fontSize={"18px"} fontWeight={500} mb={2}>
            Transaction Details
          </Typography>
          <Stack spacing={1}>
            <DetailRow
              label="Type"
              value={capitalizeFirstLetter(type.toLocaleLowerCase())}
              color={isSelectedTypeIncome ? colors.lightGreen : colors.red}
            />
            <DetailRow
              label="Category"
              value={
                getCategoryName(
                  selectedCategoryId,
                  isSelectedTypeIncome,
                  incomeCategories,
                  expenseCategories
                ) || "Not selected"
              }
            />
            <DetailRow
              label="Date"
              value={
                date ? dayjs(date).format("DD MMM, YYYY") : "Date not selected"
              }
            />
            <DetailRow label="Description" value={description || "-"} />
          </Stack>
        </Paper>
      </Box>
    </Box>
  );
};

const DetailRow: React.FC<{ label: string; value: string; color?: string }> = ({
  label,
  value,
  color,
}) => (
  <Box display="flex" justifyContent="space-between">
    <Typography variant="body1" color={colors.contentSecondary}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ color }}>
      {value}
    </Typography>
  </Box>
);

export default AddTransactionDesktop;
