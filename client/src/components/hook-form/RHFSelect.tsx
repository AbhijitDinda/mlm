import { TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------

export default function RHFSelect({
  name,
  children,
  onChangeFn,
  ...other
}: {
  name: string;
  children: React.ReactNode;
  [x: string]: any;
}) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => (
        <TextField
          value={value}
          onChange={(e) =>
            onChangeFn ? (onChange(e), onChangeFn(e.target.value)) : onChange(e)
          }
          onBlur={onBlur}
          select
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        >
          {children}
        </TextField>
      )}
    />
  );
}
