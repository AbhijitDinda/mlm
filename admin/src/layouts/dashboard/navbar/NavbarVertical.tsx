import { Box, Drawer, Stack, Typography } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Logo from "../../../components/Logo";
import { NavSectionVertical } from "../../../components/nav-section";
import Scrollbar from "../../../components/Scrollbar";
import { NAVBAR } from "../../../config";
import useCollapseDrawer from "../../../hooks/useCollapseDrawer";
import useResponsive from "../../../hooks/useResponsive";
import cssStyles from "../../../utils/cssStyles";
import CollapseButton from "./CollapseButton";
import NavbarAccount from "./NavbarAccount";
import navConfig from "./NavConfig";
import useConfiguration from "../../../hooks/useConfiguration";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("lg")]: {
    flexShrink: 0,
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.shorter,
    }),
  },
}));

// ----------------------------------------------------------------------

export default function NavbarVertical({
  isOpenSidebar,
  onCloseSidebar,
}: {
  isOpenSidebar: boolean;
  onCloseSidebar: () => void;
}) {
  const {
    siteConfiguration: { kycVerification },
  } = useConfiguration();
  const theme = useTheme();
  const { pathname } = useLocation();
  const isDesktop = useResponsive("up", "lg");

  const {
    isCollapse,
    collapseClick,
    collapseHover,
    onToggleCollapse,
    onHoverEnter,
    onHoverLeave,
  } = useCollapseDrawer();

  useEffect(() => {
    if (isOpenSidebar) {
      onCloseSidebar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        "& .simplebar-content": {
          height: 1,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Stack
        spacing={3}
        sx={{
          pt: 3,
          pb: 2,
          px: 2.5,
          flexShrink: 0,
          ...(isCollapse && { alignItems: "center" }),
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Logo
            isCollapse={isCollapse}
            isDesktop={isDesktop}
            isOpenSidebar={isOpenSidebar}
            disabledLink
          />

          {isDesktop && !isCollapse && (
            <CollapseButton
              onToggleCollapse={onToggleCollapse}
              collapseClick={collapseClick}
            />
          )}
        </Stack>

        <NavbarAccount isCollapse={isCollapse} />
      </Stack>

      <NavSectionVertical
        navConfig={navConfig({ kyc: kycVerification })}
        isCollapse={isCollapse}
      />
      <Box sx={{ flexGrow: 1, paddingBottom: 20 }} />
    </Scrollbar>
  );

  return (
    <RootStyle
      sx={{
        width: {
          lg: isCollapse
            ? NAVBAR.DASHBOARD_COLLAPSE_WIDTH
            : NAVBAR.DASHBOARD_WIDTH,
        },
        ...(collapseClick && {
          position: "absolute",
        }),
      }}
    >
      {!isDesktop && (
        <Drawer
          open={isOpenSidebar}
          onClose={onCloseSidebar}
          PaperProps={{ sx: { width: NAVBAR.DASHBOARD_WIDTH } }}
        >
          {renderContent}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          open
          variant="persistent"
          onMouseEnter={onHoverEnter}
          onMouseLeave={onHoverLeave}
          PaperProps={{
            sx: {
              width: NAVBAR.DASHBOARD_WIDTH,
              borderRightStyle: "dashed",
              transition: (theme) =>
                theme.transitions.create("width", {
                  duration: theme.transitions.duration.standard,
                }),
              ...(isCollapse && {
                width: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
              }),
              ...(collapseHover && {
                ...cssStyles(theme).bgBlur(),
                boxShadow: (theme) => theme.customShadows.z24,
              }),
            },
          }}
        >
          {renderContent}
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <Typography>
              <span style={{ color: "#fd7e14" }}>Jamsrmlm</span> V <sup>5</sup>
            </Typography>
          </Box>
        </Drawer>
      )}
    </RootStyle>
  );
}
