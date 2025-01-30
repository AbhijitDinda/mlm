import { Box, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { NumberFormatBase, NumericFormat } from "react-number-format";
import useConfiguration from "../../hooks/useConfiguration";
// ----------------------------------------------------------------------

interface Props {
  name: string;
  maskNumber?: boolean;
  maskCurrency?: boolean;
  maskPercent?: boolean;
  maskAlpha?: boolean;
  maskAlphaNumeric?: boolean;
  [x: string]: any;
}

const RHFTextField: React.FC<Props> = ({
  name,
  maskNumber,
  maskCurrency,
  maskPercent,
  maskAlpha,
  maskAlphaNumeric,
  onChangeFn,
  ...props
}) => {
  const { control } = useFormContext();
  const { currency, currencyPosition } = useConfiguration();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { error },
      }) => {
        if (maskNumber) {
          return (
            <NumericFormat
              customInput={TextField}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              fullWidth
              error={!!error}
              helperText={error?.message}
              {...props}
            />
          );
        }
        if (maskCurrency) {
          return (
            <NumericFormat
              allowNegative={false}
              decimalScale={2}
              customInput={TextField}
              InputProps={{
                ...(currencyPosition === "prefix"
                  ? { startAdornment: <Box>{currency}</Box> }
                  : { endAdornment: <Box>{currency}</Box> }),
              }}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              fullWidth
              error={!!error}
              helperText={error?.message}
              {...props}
            />
          );
        }
        if (maskPercent) {
          return (
            <NumericFormat
              decimalScale={2}
              customInput={TextField}
              InputProps={{ endAdornment: <div>%</div> }}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              fullWidth
              error={!!error}
              helperText={error?.message}
              {...props}
            />
          );
        }
        return (
          <TextField
            value={value}
            onChange={(e) =>
              onChangeFn ? (onChange(e), onChangeFn(e.target.value)) : onChange(e)
            }
            onBlur={onBlur}
            fullWidth
            error={!!error}
            helperText={error?.message}
            {...props}
          />
        );
      }}
    />
  );
};

export default RHFTextField;
