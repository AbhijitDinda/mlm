import { TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

export default function RHFDatePicker({
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
      render={({ field, fieldState: { error } }) => {
        return (
          <DesktopDatePicker
            {...field}
            {...other}
            inputFormat="MM/dd/yyyy"
            renderInput={(params) => {
              return (
                <TextField
                  fullWidth
                  error={!!error?.message}
                  helperText={error?.message}
                  {...params}
                  name={name}
                />
              );
            }}
          />
        );
      }}
    />
  );
}
