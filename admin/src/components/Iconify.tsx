import { Icon } from "@iconify/react";
import { Box } from "@mui/material";

// ----------------------------------------------------------------------
interface Props {
  icon: string;
  sx?: object;
  [x: string]: any;
}

export default function Iconify({ icon, sx, ...other }: Props) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}
