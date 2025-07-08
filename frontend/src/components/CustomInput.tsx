import React, {
  CSSProperties,
  ReactElement,
  RefCallback,
  useState,
} from "react";
import { Stack, TextField, TextFieldProps, Typography } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import { InputBaseComponentProps } from "@mui/material";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { colors } from "../constants";

export type CustomInputProps = TextFieldProps & {
  styles?: CSSProperties;
  inputStyles?: CSSProperties;
  placeholder?: string;
  isProtected?: boolean;
  startIcon?: ReactElement;
  endIcon?: ReactElement;
  dataTestId?: string;
  inputProps?: InputBaseComponentProps;
  textFieldInputSx?: any;
};

const CustomInput = React.forwardRef<HTMLElement, CustomInputProps>(
  function CustomInput(
    {
      styles,
      inputStyles,
      dataTestId,
      placeholder = "",
      isProtected = false,
      label,
      startIcon,
      endIcon,
      type,
      inputProps,
      error,
      InputProps,
      sx,
      textFieldInputSx,
      ...props
    },
    ref
  ) {
    const [showInput, setShowInput] = useState(!isProtected);

    return (
      <Stack
        sx={{
          ...(styles && { ...styles }),
        }}
        gap={"4px"}
      >
        <TextField
          variant="filled"
          type={showInput ? type || "text" : "password"}
          inputRef={ref as RefCallback<HTMLTextAreaElement | HTMLInputElement>}
          sx={{
            input: {
              ...(error && { color: colors.red }),
              "&::placeholder": {
                color: colors.contentTertiary,
                padding: 0,
                opacity: 1,
              },
              ...textFieldInputSx,
            },
            ...sx,
          }}
          placeholder={placeholder}
          InputProps={{
            ...(startIcon && {
              startAdornment: (
                <Stack color={colors.contentTertiary} sx={{ pl: 2 }}>
                  {startIcon}
                </Stack>
              ),
            }),
            ...(endIcon && {
              endAdornment: (
                <Stack color={colors.contentTertiary} sx={{ pr: 2 }}>
                  {endIcon}
                </Stack>
              ),
            }),
            ...(isProtected && {
              endAdornment: (
                <InputAdornment position="end" sx={{ pr: 2 }}>
                  <IconButton
                    onClick={() => setShowInput(!showInput)}
                    edge="end"
                    size="small"
                  >
                    {showInput ? (
                      <VisibilityOutlined />
                    ) : (
                      <VisibilityOffOutlined />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }),
            disableUnderline: true,
            inputProps: {
              style: {
                padding: "0.75rem 1rem",
                borderRadius: "24px 0 0 24px",
                border: 0,
              },
              ...inputProps,
              "data-testid": dataTestId,
            },
            sx: {
              fontSize: "1rem",
              padding: 0,
              borderRadius: 4,
              backgroundColor: error ? colors.lightRed : colors.grey,
              "& textarea::placeholder": {
                color: colors.contentTertiary,
                padding: 0,
                opacity: 1,
              },
              ...(inputStyles && { ...inputStyles }),
            },
            ...InputProps,
          }}
          {...props}
        />
        <Typography
          sx={{
            px: 2,
            color: error ? colors.red : colors.contentSecondary,
            fontSize: "12px",
          }}
        >
          {label}
        </Typography>
      </Stack>
    );
  }
);

export default CustomInput;
