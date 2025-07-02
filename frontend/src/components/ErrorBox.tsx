import { WarningAmberRounded } from "@mui/icons-material";
import { List, ListItem, Stack, SxProps, Typography } from "@mui/material";
import { FieldValues, FormState } from "react-hook-form";
import { colors } from "../constants";

type Props = { formState: FormState<FieldValues>; style?: SxProps };

const ErrorBox = ({ formState, style }: Props) => {
  const hasErrors = Object.keys(formState.errors).length > 0;

  if (!hasErrors) {
    return null;
  }

  const uniqueErrors = new Set<string>();
  const uniqueErrorList: { key: string; message: string }[] = [];

  Object.entries(formState.errors).forEach(([key, value]) => {
    const extractErrorMessage = (errorObj: any): string => {
      if (errorObj?.message) {
        return errorObj.message;
      } else if (typeof errorObj === "object") {
        for (const prop in errorObj) {
          return extractErrorMessage(errorObj[prop]);
        }
      }

      return `Please ensure that you've provided valid information for all required fields.`;
    };

    const errorMessage = extractErrorMessage(value);

    if (!uniqueErrors.has(errorMessage)) {
      uniqueErrors.add(errorMessage);
      uniqueErrorList.push({ key, message: errorMessage });
    }
  });

  return (
    <Stack
      sx={{ bgcolor: colors.lightRed, borderRadius: 6, p: 3, ...style }}
      gap={2}
    >
      <WarningAmberRounded />
      <List sx={{ p: 0 }}>
        {uniqueErrorList.map(({ message }, index) => (
          <ListItem key={index} sx={{ p: 0 }}>
            <Typography variant="body2" fontSize={"1rem"} component="div">
              {`- ${message}`}
            </Typography>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default ErrorBox;
