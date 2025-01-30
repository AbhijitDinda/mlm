import { Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import useConfiguration from "../hooks/useConfiguration";
import { APP_PATH } from "../routes/paths";
import Image from "./Image";

// ----------------------------------------------------------------------

export default function Logo({
  isDesktop,
  isCollapse,
  isOpenSidebar,
  disabledLink = false,
  sx,
}: {
  isDesktop?: boolean | null;
  isCollapse?: boolean;
  isOpenSidebar?: boolean;
  disabledLink?: boolean;
  sx?: Object;
}) {
  const { logo, fullLogo } = useConfiguration();

  const _logo =
    (isOpenSidebar || isDesktop) && !isCollapse ? (
      <Box sx={sx}>
        <Image cover={false} src={fullLogo} />
      </Box>
    ) : (
      <Box sx={{ width: 40, height: 40, ...sx }}>
        <Image src={logo} />
      </Box>
    );

  if (disabledLink) {
    return <>{_logo}</>;
  }

  return <RouterLink to={APP_PATH.home}>{_logo}</RouterLink>;
}
