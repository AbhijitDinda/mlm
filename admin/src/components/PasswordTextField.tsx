import { IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import { RHFTextField } from "./hook-form";
import Iconify from "./Iconify";

export default function ({
  name,
  label,
  ...otherProps
}: {
  name: string;
  label: string;
  [x: string]: any;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <RHFTextField
      name={name}
      type={showPassword ? "text" : "password"}
      label={label}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="Toggle Password"
              onClick={handleTogglePassword}
              edge="end"
            >
              {showPassword ? (
                <Iconify icon={"eva:eye-off-fill"} />
              ) : (
                <Iconify icon={"eva:eye-fill"} />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...otherProps}
    />
  );
}
