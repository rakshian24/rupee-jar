import { AddOutlined, CloseOutlined } from "@mui/icons-material";
import { screenSize } from "../../../constants";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { ICreateTodoFormValueTypes, InitCreateTodoFormValues } from "./helper";
import { CREATE_TODO } from "../../../graphql/mutations";
import { useMutation } from "@apollo/client";
import { useState } from "react";
import CustomSnackBar from "../../../components/CustomSnackBar";
import CustomInput from "../../../components/CustomInput";
import { NumberRegex, textInputRegex } from "../../../utils";
import ErrorBox from "../../../components/ErrorBox";
import TagInput from "../../../components/TagInput";
import Button from "../../../components/CustomButton";

type Props = {
  handleClose: () => void;
  open: boolean;
  onTodoCreated: () => void;
};

const CreateTodoDialog = ({ open, handleClose, onTodoCreated }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const isTablet = useMediaQuery(`(max-width:${screenSize.tablet})`);

  const { control, formState, handleSubmit, reset } = useForm({
    defaultValues: { ...InitCreateTodoFormValues },
    mode: "onChange",
  });

  const [createTodo, { loading: isCreateTodoLoading }] =
    useMutation(CREATE_TODO);

  const { errors } = formState;
  const COMMON_PROPS = { control: control, errors: errors };
  const isFormDisabled = !formState.isValid;

  const onSubmitHandler = async (formValues: ICreateTodoFormValueTypes) => {
    setIsLoading(true);

    try {
      await createTodo({
        variables: {
          todoInput: {
            ...formValues,
          },
        },
      });
      setSnackbarMessage("Todo created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      onTodoCreated();

      handleClose();
      reset({
        ...InitCreateTodoFormValues,
      });
    } catch (error) {
      console.error("Error while creating todo: ", error);

      setSnackbarMessage("Something went wrong!");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <CustomSnackBar
        open={snackbarOpen}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
      <Dialog
        fullScreen={isTablet}
        fullWidth
        maxWidth={"sm"}
        PaperProps={{
          style: {
            borderRadius: !isTablet ? "32px" : "0",
          },
        }}
        open={open}
      >
        <Stack
          component={"form"}
          noValidate
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          <DialogContent
            dividers
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 5,
              pb: 1,
              ...(isTablet && { px: 2, pt: 3 }),
              gap: 4,
              borderBottom: "none",
            }}
          >
            <DialogTitle sx={{ p: 0 }}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Typography fontSize={isTablet ? 24 : 28} fontWeight={700}>
                  {"Create Todo"}
                </Typography>
                <IconButton onClick={handleClose} sx={{ ml: "auto" }}>
                  <CloseOutlined />
                </IconButton>
              </Stack>
            </DialogTitle>
            <Stack gap={2}>
              <Controller
                name="title"
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
                    placeholder="Enter todo title"
                    label="Todo title"
                    dataTestId="todoTitle"
                  />
                )}
              />
              <Controller
                name="description"
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
                    minRows={2}
                    {...field}
                    error={error !== undefined}
                    styles={{ width: "100%" }}
                    placeholder="Enter todo description"
                    label="Todo Description"
                    dataTestId="todoDescription"
                  />
                )}
              />

              <ErrorBox formState={formState} style={{ mb: 2 }} />
            </Stack>
          </DialogContent>
          <Box
            sx={{
              py: isTablet ? 0 : 2,
              px: isTablet ? 2 : 5,
              pb: 5,
              justifyContent: "flex-start",
            }}
          >
            <Button
              buttonText={"Create"}
              endIcon={<AddOutlined />}
              isLoading={isLoading || isCreateTodoLoading}
              disabled={isFormDisabled}
              onClick={() => onSubmitHandler}
            />
          </Box>
        </Stack>
      </Dialog>
    </>
  );
};

export default CreateTodoDialog;
