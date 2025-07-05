import React, { RefCallback } from "react";
import CustomInput, { CustomInputProps } from "./CustomInput";

export const CustomInputField = React.forwardRef<HTMLElement, CustomInputProps>(
  function CustomInputField({ label, ...rest }, ref) {
    return (
      <CustomInput
        inputRef={ref as RefCallback<HTMLTextAreaElement | HTMLInputElement>}
        label={label}
        {...rest}
      />
    );
  }
);
