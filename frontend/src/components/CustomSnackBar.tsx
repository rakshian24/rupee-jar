import React from "react";
import { Snackbar, Alert, AlertProps } from "@mui/material";

interface SnackbarComponentProps {
  open: boolean;
  onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  message: string;
  severity?: AlertProps["severity"];
}

const CustomSnackBar: React.FC<SnackbarComponentProps> = ({
  open,
  onClose,
  message,
  severity = "success",
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackBar;
