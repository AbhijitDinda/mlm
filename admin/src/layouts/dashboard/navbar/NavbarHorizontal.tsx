import { AppBar, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { memo } from "react";
import { NavSectionHorizontal } from "../../../components/nav-section";
import { HEADER } from "../../../config";
import navConfig from "./NavConfig";
import useConfiguration from "../../../hooks/useConfiguration";

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar)(({ theme }) => ({
  transition: theme.transitions.create("top", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  width: "100%",
  position: "fixed",
  zIndex: theme.zIndex.appBar,
  padding: theme.spacing(1, 0),
  boxShadow: theme.customShadows.z8,
  top: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

function NavbarHorizontal() {
  const {
    siteConfiguration: { kycVerification },
  } = useConfiguration();
  return (
    <RootStyle>
      <Container maxWidth={false}>
        <NavSectionHorizontal navConfig={navConfig({ kyc: kycVerification })} />
      </Container>
    </RootStyle>
  );
}

export default memo(NavbarHorizontal);
