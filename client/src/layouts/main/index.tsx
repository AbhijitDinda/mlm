import { Outlet } from "react-router-dom";
// @mui
import { Box, Link, Container, Stack } from "@mui/material";
//
import MainFooter from "./MainFooter";
import MainHeader from "./MainHeader";
import { HEADER } from "../../config";

import { useLocation } from "react-router-dom";

// ----------------------------------------------------------------------

export default function MainLayout() {
  const fullWidthsPages = ["/about-us", "/"];

  const { pathname } = useLocation();
  const isFullWidth = fullWidthsPages.includes(pathname);

  return (
    <Stack sx={{ minHeight: 1 }}>
      <MainHeader />
      {isFullWidth ? (
        <Box
          sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
        >
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              pt: {
                xs: `${HEADER.MOBILE_HEIGHT + 12}px`,
                lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 12}px`,
              },
            }}
          >
            <Outlet />
          </Box>
          <MainFooter />
        </Box>
      ) : (
        <Box
          sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
        >
          <Container sx={{ p: 0, display: "flex", flex: 1 }}>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                px: { lg: 2 },
                pt: {
                  xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
                  lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
                },
                pb: {
                  xs: `${HEADER.MOBILE_HEIGHT + 24}px`,
                  lg: `${HEADER.DASHBOARD_DESKTOP_HEIGHT + 80}px`,
                },
              }}
            >
              <Outlet />
            </Box>
          </Container>
          <MainFooter />
        </Box>
      )}
    </Stack>
  );
}
