import { FormControlLabel, Switch } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

// ----------------------------------------------------------------------



export default function RHFSwitch({
  name,
  ...other
}: {
  name: string;
  [x: string]: any;
}) {
  const { control } = useFormContext();

  return (
    <FormControlLabel
      label
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Switch {...field} checked={field.value} />}
        />
      }
      {...other}
    />
  );
}
