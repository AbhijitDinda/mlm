import { Box, TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";
import useConfiguration from "../hooks/useConfiguration";

const CurrencyTextField = (props: { [x: string]: any }) => {
  const { currency, currencyPosition } = useConfiguration();
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
      fullWidth
      {...props}
    />
  );
};

export default CurrencyTextField;
