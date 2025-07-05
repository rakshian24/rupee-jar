import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Backdrop,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { ILoginFormValueTypes, InitialLoginFormValues } from "./helpers";
import { emailRegex, textInputRegex } from "../../utils";
import CustomInput from "../CustomInput";
import { Link, useNavigate } from "react-router-dom";
import { colors, ROUTES, screenSize } from "../../constants";
import { useMutation } from "@apollo/client";
import { useAuth } from "../../context/authContext";
import { LOGIN_MUTATION } from "../../graphql/mutations";
import Button from "../CustomButton";
import { NavigateNext } from "@mui/icons-material";
import ErrorBox from "../ErrorBox";

const Login = () => {
  const { user, storeTokenInLS } = useAuth();
  const navigate = useNavigate();
  const { control, formState, handleSubmit } = useForm({
    defaultValues: { ...InitialLoginFormValues },
    mode: "onChange",
  });
  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const { errors } = formState;
  const COMMON_PROPS = { control: control, errors: errors };
  const isFormDisabled = !formState.isValid;

  useEffect(() => {
    if (user?.userId) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [navigate, user?.userId]);

  const [registerUser, { loading }] = useMutation(LOGIN_MUTATION);

  const onSubmitHandler = async (formValues: ILoginFormValueTypes) => {
    const { data } = await registerUser({
      variables: {
        input: { ...formValues },
      },
    });
    if (data?.loginUser?.token) {
      storeTokenInLS(data?.loginUser?.token);
      navigate(ROUTES.DASHBOARD);
    }
  };

  return (
    <Stack gap={isTablet ? 3 : 5} width={"100%"} mt={isTablet ? 5 : 0}>
      <Typography fontSize={isTablet ? 24 : 30} fontWeight={600}>
        Login
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
              name="email"
              {...COMMON_PROPS}
              rules={{
                required: true,
                pattern: {
                  value: emailRegex,
                  message: "Invalid characters",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <CustomInput
                  {...field}
                  error={error !== undefined}
                  styles={{ width: "100%" }}
                  placeholder="Enter email"
                  label="Email"
                />
              )}
            />

            <Controller
              name="password"
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
                  isProtected
                  {...field}
                  error={error !== undefined}
                  styles={{ width: "100%" }}
                  placeholder="Enter password"
                  label="Password"
                />
              )}
            />
            <ErrorBox formState={formState} style={{ mb: 2 }} />
            <Stack
              display={"flex"}
              direction={isTablet ? "column" : "row"}
              justifyContent={"space-between"}
              alignItems={isTablet ? "flex-start" : "center"}
              mt={1}
              gap={2}
            >
              <Typography>
                Don't have an account?
                <Link
                  to={ROUTES.REGISTER}
                  style={{
                    marginLeft: "4px",
                    fontWeight: 500,
                    color: colors.lightGreen,
                  }}
                >
                  Register here
                </Link>
              </Typography>
              <Button
                buttonText="Log in"
                onClick={() => onSubmitHandler}
                disabled={isFormDisabled}
                endIcon={<NavigateNext />}
                styles={{ alignSelf: "flex-end" }}
              />
            </Stack>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};

export default Login;
