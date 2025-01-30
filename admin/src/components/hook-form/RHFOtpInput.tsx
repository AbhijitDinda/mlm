import { Box, FormHelperText } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { Controller, useFormContext } from "react-hook-form";
import { RESPONSIVE_GAP } from "../../config";
// ----------------------------------------------------------------------

export default function RHFOtpInput({
  name,
  ...other
}: {
  name: string;
  [x: string]: any;
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <MuiOtpInput
            {...field}
            {...other}
            length={6}
            sx={{ gap: RESPONSIVE_GAP }}
            TextFieldsProps={{ placeholder: "-", error: !!error }}
          />
          {!!error && <FormHelperText error>{error?.message}</FormHelperText>}
        </Box>
      )}
    />
  );
}
