import React, { useEffect, useState } from "react";
import {
  Box,
  MenuItem,
  Typography,
  Stack,
  useMediaQuery,
  SelectChangeEvent,
} from "@mui/material";

import {
  colors,
  INDIAN_RUPEE_SYMBOL,
  ROUTES,
  screenSize,
} from "../../constants";
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
import { Windows1252Regex } from "../../utils";
import Button from "../../components/CustomButton";
import ErrorBox from "../../components/ErrorBox";
import { useNavigate } from "react-router-dom";
import CategorySelection from "../../components/CategorySelection";

const AddTransactionMobile: React.FC = () => {
  const { data: userData, loading: isMeLoading, refetch } = useQuery(GET_ME);
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [currentAccount, setCurrentAccount] = useState<Account | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");

  const navigate = useNavigate();

  const [createAccount, { loading }] = useMutation(CREATE_TRANSACTION);

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
    const { data } = await createAccount({
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
    <Stack
      gap={3}
      component="form"
      noValidate
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <CustomSegmentedToggle
          options={toggleOptions}
          selected={type}
          onChange={(newValue: TransactionType) => {
            if (newValue !== type) {
              setType(newValue);
            }
          }}
          sx={{ flex: 1, py: 1.25 }}
          thumbColor={colors.grey1}
          bgColor={colors.lightGreen}
          wrapperSx={{ width: isTablet ? "95%" : "auto" }}
        />
      </Box>

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
              type === TransactionType.EXPENSE &&
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
            textFieldInputSx={{ fontSize: "35px" }}
            placeholder={"Enter transaction amount"}
            label={"Transaction amount"}
            error={error !== undefined}
            startIcon={<FaRupeeSign style={{ fontSize: "22px" }} />}
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
                {paymentMethod === PaymentMethod.CASH ? "Cash" : paymentMethod}
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

      <ErrorBox formState={formState} style={{ my: 2 }} />

      <Stack
        bgcolor={"#F9FAFB"}
        borderRadius={3}
        p={2}
        gap={1.5}
        border={`1px solid ${colors.grey}`}
        mb={1}
      >
        <BalanceDetailsRow label="Current Balance" value={balance} />
        {amount ? (
          <BalanceDetailsRow
            label="Transaction Amount"
            value={`${
              isSelectedTypeIncome
                ? `+ ${INDIAN_RUPEE_SYMBOL}`
                : `- ${INDIAN_RUPEE_SYMBOL}`
            }${amount}`}
            showTransactionAmount
          />
        ) : null}
        <BalanceDetailsRow
          label="New Balance"
          value={newBalance}
          valueColor={isSelectedTypeIncome ? colors.lightGreen : colors.red}
        />
      </Stack>

      <Button
        buttonText="Save Transaction"
        disabled={isFormDisabled}
        styles={{ mb: 2 }}
      />
    </Stack>
  );
};

type BalanceDetailsRowProps = {
  label: string;
  value: number | string;
  valueColor?: string;
  showTransactionAmount?: boolean;
};

const BalanceDetailsRow = ({
  label,
  value,
  valueColor = colors.black,
  showTransactionAmount = false,
}: BalanceDetailsRowProps) => {
  const amount = showTransactionAmount
    ? value
    : `${INDIAN_RUPEE_SYMBOL}${value}`;
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Typography color={colors.contentSecondary}>{label}</Typography>
      <Typography color={valueColor} fontWeight={500}>
        {amount}
      </Typography>
    </Stack>
  );
};

export default AddTransactionMobile;
