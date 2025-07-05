import {
  Backdrop,
  Box,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { APP_NAME, colors, screenSize } from "../../../constants";
import NoAccountImg from "../../../assets/pngs/no-account.png";
import useResponsiveFontSizes from "../../../hooks/useResponsiveFontSizes";
import { useAuth } from "../../../context/authContext";
import { useMutation, useQuery } from "@apollo/client";
import { CREATE_ACCOUNT_MUTATION } from "../../../graphql/mutations";
import { Controller, useForm } from "react-hook-form";
import {
  ICreateAccFormValueTypes,
  InitialCreateAccFormValues,
} from "./helpers";
import { textInputRegex } from "../../../utils";
import CustomInput from "../../../components/CustomInput";
import ErrorBox from "../../../components/ErrorBox";
import { CustomInputField } from "../../../components/CustomInputField";
import { FaRupeeSign } from "react-icons/fa";
import Button from "../../../components/CustomButton";
import { AddOutlined } from "@mui/icons-material";
import { GET_ME } from "../../../graphql/queries";

type Props = {};

const NoAccount = (props: Props) => {
  const { user } = useAuth();
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const { pageHeading, sectionTitle } = useResponsiveFontSizes();

  const [createAccount, { loading }] = useMutation(CREATE_ACCOUNT_MUTATION);
  const { refetch } = useQuery(GET_ME);

  const { control, formState, handleSubmit } = useForm({
    defaultValues: { ...InitialCreateAccFormValues },
    mode: "onChange",
  });

  const { errors } = formState;
  const COMMON_PROPS = { control: control, errors: errors };
  const isFormDisabled = !formState.isValid;

  const onSubmitHandler = async (formValues: ICreateAccFormValueTypes) => {
    const { data } = await createAccount({
      variables: {
        input: {
          ...formValues,
          userId: user?.userId,
        },
      },
    });

    if (data?.createAccount?._id) {
      refetch();
    }
  };

  return (
    <Stack gap={isTablet ? 3 : 6}>
      <Stack gap={1}>
        <Typography fontSize={pageHeading}>Welcome to {APP_NAME}</Typography>
        <Typography variant="body1" color={colors.contentSecondary}>
          Your personal finance companion
        </Typography>
      </Stack>
      <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
        <Stack
          bgcolor={colors.white}
          borderRadius={2}
          alignItems={"center"}
          px={isTablet ? 3 : 10}
          py={3}
          maxWidth={"500px"}
        >
          <img src={NoAccountImg} alt="no-account-image" width={300} />
          <Typography fontSize={sectionTitle} fontWeight={"500"} mb={1}>
            No accounts found
          </Typography>
          <Typography
            mb={2}
            textAlign={"center"}
            color={colors.contentSecondary}
          >
            You haven't created any bank accounts yet.
            <br /> Create your first account to start tracking your finances and
            managing your money effectively.
          </Typography>

          <Stack gap={isTablet ? 3 : 5} width={"100%"} mt={isTablet ? 5 : 0}>
            <Typography
              textAlign={"center"}
              fontSize={sectionTitle}
              fontWeight={500}
            >
              Create Your First Account
            </Typography>
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <Stack>
              <form noValidate onSubmit={handleSubmit(onSubmitHandler)}>
                <Stack gap={2}>
                  <Controller
                    name="bankName"
                    {...COMMON_PROPS}
                    rules={{
                      required: true,
                      pattern: {
                        value: textInputRegex,
                        message: "Invalid characters",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        {...field}
                        error={error !== undefined}
                        styles={{ width: "100%" }}
                        placeholder="Enter bank name"
                        label="Bank name"
                      />
                    )}
                  />
                  <Controller
                    name="accountNumber"
                    {...COMMON_PROPS}
                    rules={{
                      required: true,
                      pattern: {
                        value: textInputRegex,
                        message: "Invalid characters",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInput
                        {...field}
                        error={error !== undefined}
                        styles={{ width: "100%" }}
                        placeholder="Enter account number"
                        label="Account number"
                      />
                    )}
                  />
                  <Controller
                    name="balance"
                    {...COMMON_PROPS}
                    rules={{
                      required: "Balance amount is required",
                      min: {
                        value: 1,
                        message: "Balance amount must be greater than 0",
                      },
                    }}
                    render={({ field, fieldState: { error } }) => (
                      <CustomInputField
                        {...field}
                        type="number"
                        onChange={(e) => {
                          let inputValue = e.target.value.replace(
                            /^0+(?!\.)/,
                            ""
                          );

                          // Handle edge cases: empty string, dot-only input, and leading dot
                          if (!inputValue || inputValue === ".") {
                            inputValue = "0";
                          } else if (inputValue.startsWith(".")) {
                            inputValue = `0${inputValue}`;
                          }
                          field.onChange(inputValue);
                        }}
                        sx={{ width: "100%" }}
                        placeholder={"Enter balance amount"}
                        label={"Balance amount"}
                        error={error !== undefined}
                        startIcon={<FaRupeeSign />}
                      />
                    )}
                  />

                  <ErrorBox formState={formState} style={{ mb: 2 }} />

                  <Box sx={{ alignSelf: "flex-end" }}>
                    <Button
                      buttonText="Create Account"
                      onClick={() => onSubmitHandler}
                      disabled={isFormDisabled}
                      startIcon={<AddOutlined />}
                    />
                  </Box>
                </Stack>
              </form>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Stack>
  );
};

export default NoAccount;
