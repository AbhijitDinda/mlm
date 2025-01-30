import { MuiTelInput } from "mui-tel-input";
import { Controller, useFormContext } from "react-hook-form";
import useConfiguration from "../../hooks/useConfiguration";

// ----------------------------------------------------------------------

const RHFTelInput = ({
  name,
  ...other
}: {
  name: string;
  [x: string]: any;
}) => {
  const { control } = useFormContext();
  const { country } = useConfiguration();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <>
          <MuiTelInput
            {...field}
            {...other}
            //@ts-ignore //todo
            defaultCountry={country}
            focusOnSelectCountry
            error={!!error}
            helperText={error?.message}
            fullWidth
          />
        </>
      )}
    />
  );
};

export default RHFTelInput;
