import { Avatar as MUIAvatar, SxProps } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { forwardRef } from "react";
import { PaletteBasicColor } from "../theme";
import { getFileSrc } from "../utils/fns";

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode;
  color?: PaletteBasicColor | "default";
  sx: SxProps;
  src: string;
  [x: string]: any;
}

const Avatar = forwardRef<null, Props>(
  ({ color = "default", children, sx, src, ...other }, ref) => {
    const theme = useTheme();

    if (color === "default") {
      return (
        <MUIAvatar src={getFileSrc(src)} ref={ref} sx={sx} {...other}>
          {children}
        </MUIAvatar>
      );
    }

    return (
      <MUIAvatar
        ref={ref}
        src={getFileSrc(src)}
        sx={{
          fontWeight: theme.typography.fontWeightMedium,
          color: theme.palette[color].contrastText,
          backgroundColor: theme.palette[color].main,
          ...sx,
        }}
        {...other}
      >
        {children}
      </MUIAvatar>
    );
  }
);

export default Avatar;
