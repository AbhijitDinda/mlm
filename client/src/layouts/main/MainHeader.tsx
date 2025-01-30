import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import Logo from "../../components/Logo";
import { HEADER } from "../../config";
import useAuth from "../../hooks/useAuth";
import useOffSetTop from "../../hooks/useOffSetTop";
import APP_PATH from "../../routes/paths";
import cssStyles from "../../utils/cssStyles";
import useResponsive from "../../hooks/useResponsive";

// ----------------------------------------------------------------------

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  height: HEADER.MOBILE_HEIGHT,
  transition: theme.transitions.create(["height", "background-color"], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up("md")]: {
    height: HEADER.MAIN_DESKTOP_HEIGHT,
  },
}));

const ToolbarShadowStyle = styled("div")(({ theme }) => ({
  left: 0,
  right: 0,
  bottom: 0,
  height: 24,
  zIndex: -1,
  margin: "auto",
  borderRadius: "50%",
  position: "absolute",
  width: `calc(100% - 48px)`,
  boxShadow: theme.customShadows.z8,
}));

// ----------------------------------------------------------------------

export default function MainHeader() {
  const isOffset = useOffSetTop(HEADER.MAIN_DESKTOP_HEIGHT);
  const theme = useTheme();
  const { isAuthenticated } = useAuth();
  const isDesktop = useResponsive("up", "md");

  return (
    <AppBar sx={{ boxShadow: 0, bgcolor: "transparent" }}>
      <ToolbarStyle
        disableGutters
        sx={{
          ...(isOffset && {
            ...cssStyles(theme).bgBlur(),
            height: { md: HEADER.MAIN_DESKTOP_HEIGHT - 16 },
          }),
        }}
      >
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
          <Button
            color="warning"
            variant="contained"
            component={RouterLink}
            to={isAuthenticated ? APP_PATH.dashboard : APP_PATH.login}
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started"}
          </Button>
        </Container>
      </ToolbarStyle>

      {isOffset && <ToolbarShadowStyle />}
    </AppBar>
  );
}
