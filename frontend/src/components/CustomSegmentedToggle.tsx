import { Box, Typography, SxProps, Theme } from "@mui/material";
import { colors } from "../constants";

export type CustomSegmentedToggleOption<T extends string> = {
  label: string;
  value: T;
  bgColor?: string;
  textColor?: string;
};

type SegmentedToggleProps<T extends string> = {
  options: CustomSegmentedToggleOption<T>[];
  selected: T;
  onChange: (value: T) => void;
  sx?: SxProps<Theme>;
  wrapperSx?: SxProps<Theme>;
  bgColor?: string;
  thumbColor?: string;
};

const CustomSegmentedToggle = <T extends string>({
  options,
  selected,
  onChange,
  sx,
  bgColor = colors.lightGreen,
  thumbColor = colors.grey1,
  wrapperSx,
}: SegmentedToggleProps<T>) => {
  return (
    <Box
      sx={{
        display: "inline-flex",
        p: "4px",
        borderRadius: "999px",
        bgcolor: thumbColor,
        ...wrapperSx,
      }}
    >
      {options.map((option) => {
        const isSelected = option.value === selected;
        return (
          <Box
            key={option.value}
            onClick={() => onChange(option.value)}
            sx={{
              cursor: "pointer",
              borderRadius: "999px",
              px: 2,
              py: 0.8,
              minWidth: 80,
              textAlign: "center",
              bgcolor: isSelected ? option.bgColor ?? bgColor : "transparent",
              transition: "all 0.2s ease-in-out",
              ...sx,
            }}
          >
            <Typography
              fontWeight={600}
              fontSize="0.85rem"
              color={
                isSelected ? option.textColor ?? colors.white : colors.black
              }
            >
              {option.label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default CustomSegmentedToggle;
