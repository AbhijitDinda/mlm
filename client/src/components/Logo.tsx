import { Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { HEADER } from "../config";
import useConfiguration from "../hooks/useConfiguration";
import useResponsive from "../hooks/useResponsive";
import { APP_PATH } from "../routes/paths";
import Image from "./Image";

// ----------------------------------------------------------------------

export default function Logo({
  isCollapse,
  mini,
  isOpenSidebar,
  disabledLink = false,
  sx,
}: {
  isCollapse?: boolean;
  mini?: boolean;
  isOpenSidebar?: boolean;
  disabledLink?: boolean;
  sx?: Object;
}) {
  const { logo, fullLogo } = useConfiguration();
  const isDesktop = useResponsive("up", "lg");

  const _logo =
    (isOpenSidebar || isDesktop) && !isCollapse && !mini ? (
      <Box sx={sx}>
        <Image
          sx={{
            height: HEADER.MOBILE_HEIGHT - 20,
            width: "max-content",
          }}
          src={fullLogo}
        />
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
