import { Box, Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { HEADER, NAVBAR, RESPONSIVE_GAP } from "../../config";
import useCollapseDrawer from "../../hooks/useCollapseDrawer";
import useResponsive from "../../hooks/useResponsive";
import useSettings from "../../hooks/useSettings";
import DashboardFooter from "./footer";
import DashboardHeader from "./header";
import NavbarHorizontal from "./navbar/NavbarHorizontal";
import NavbarVertical from "./navbar/NavbarVertical";

// ----------------------------------------------------------------------

const MainStyle = styled("main", {
  shouldForwardProp: (prop) => prop !== "collapseClick",
})<{ collapseClick: boolean }>(({ collapseClick, theme }) => ({
  flexGrow: 1,
  minHeight: "100vh",
  paddingTop: HEADER.MOBILE_HEIGHT + 0,
  [theme.breakpoints.up("lg")]: {
    paddingTop: HEADER.DASHBOARD_DESKTOP_HEIGHT + 24,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH}px)`,
    transition: theme.transitions.create("margin-left", {
      duration: theme.transitions.duration.shorter,
    }),
    ...(collapseClick && {
      marginLeft: NAVBAR.DASHBOARD_COLLAPSE_WIDTH,
    }),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const { collapseClick, isCollapse } = useCollapseDrawer();
  const { themeStretch, themeLayout } = useSettings();
  const isDesktop = useResponsive("up", "lg");
  const [open, setOpen] = useState(false);
  const verticalLayout = themeLayout === "vertical";
  const { pathname } = useLocation();

  const stretchedPages = ["/genealogy"];
  const isStretchPage = stretchedPages.includes(pathname);

  if (verticalLayout) {
    return (
      <>
        <DashboardHeader onOpenSidebar={() => setOpen(true)} verticalLayout={verticalLayout} />

        {isDesktop ? (
          <NavbarHorizontal />
        ) : (
          <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
        )}

        <Box
          component="main"
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            px: { lg: 2 },
            pt: {
              xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
              lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
            },
          }}
        >
          <Container
            sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
            maxWidth={themeStretch || isStretchPage ? false : "lg"}
          >
            <Outlet />
            <Box sx={{ mt: RESPONSIVE_GAP }}>
              <DashboardFooter />
            </Box>
          </Container>
        </Box>
      </>
    );
  }

  return (
    <Box
      sx={{
        display: { lg: "flex" },
        minHeight: { lg: 1 },
      }}
    >
      <DashboardHeader isCollapse={isCollapse} onOpenSidebar={() => setOpen(true)} />
      <NavbarVertical isOpenSidebar={open} onCloseSidebar={() => setOpen(false)} />
      <MainStyle sx={{ display: "flex", flexDirection: "column" }} collapseClick={collapseClick}>
        <Container
          sx={{ display: "flex", flexGrow: 1, paddingBottom: 3, p: RESPONSIVE_GAP }}
          maxWidth={themeStretch || isStretchPage ? false : "lg"}
        >
          <Outlet />
        </Container>
        <DashboardFooter />
      </MainStyle>
    </Box>
  );
}
