import React, { CSSProperties, ReactNode, RefCallback } from "react";
import { Select, SelectProps, Stack, Typography } from "@mui/material";
import { MenuItem } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { colors } from "../constants";

type Props = SelectProps & {
  styles?: CSSProperties;
  selectStyles?: CSSProperties;
  placeholder?: string;
  showPlaceholderAsOption?: boolean;
  dataTestId?: string;
  children: ReactNode;
};

const CustomSelect = React.forwardRef<HTMLElement, Props>(function CustomSelect(
  {
    styles,
    selectStyles,
    dataTestId,
    placeholder = "",
    showPlaceholderAsOption = false,
    label,
    children,
    error,
    ...props
  },
  ref
) {
  return (
    <Stack
      sx={{
        ...(styles && { ...styles }),
        overflow: "hidden",
      }}
      gap={"4px"}
    >
      <Select
        {...props}
        inputRef={ref as RefCallback<HTMLTextAreaElement | HTMLInputElement>}
        variant="filled"
        disableUnderline
        IconComponent={ExpandMoreIcon}
        data-testid={dataTestId}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 300,
              maxWidth: 600,
              marginTop: 0.5,
              borderRadius: "16px",
            },
          },
        }}
        sx={{
          fontSize: "1rem",
          borderRadius: 4,
          border: 0,
          backgroundColor: error ? colors.lightRed : colors.grey,
          ...(error && { color: colors.red }),
          "& .MuiSelect-select .notranslate::after": placeholder
            ? {
                content: `"${placeholder}"`,
                color: colors.contentTertiary,
              }
            : {},
          "& .MuiSelect-select": {
            padding: "0.75rem 1rem",
            border: 0,

            "&:focus": {
              borderRadius: 6,
              backgroundColor: "transparent",
            },
          },
          "& .MuiSelect-icon": {
            color: colors.contentTertiary,
          },
          ...(selectStyles && { ...selectStyles }),
        }}
      >
        {showPlaceholderAsOption && (
          <MenuItem title={placeholder} value="">
            <em>{placeholder}</em>
          </MenuItem>
        )}
        {children}
      </Select>
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
});

export default CustomSelect;
