import { FormHelperText } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
// ----------------------------------------------------------------------

interface Props {
  name: string;
  [x: string]: any;
}

const RHFHiddenInput: React.FC<Props> = ({ name }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => {
        return <FormHelperText error>{error?.message}</FormHelperText>;
      }}
    />
  );
};

export default RHFHiddenInput;
