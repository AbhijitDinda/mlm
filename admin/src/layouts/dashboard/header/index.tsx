import { AppBar, Box, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { IconButtonAnimate } from "../../../components/animate";
import Iconify from "../../../components/Iconify";
import Logo from "../../../components/Logo";
import { HEADER, NAVBAR } from "../../../config";
import useOffSetTop from "../../../hooks/useOffSetTop";
import useResponsive from "../../../hooks/useResponsive";
import cssStyles from "../../../utils/cssStyles";
import AccountPopover from "./AccountPopover";

// ----------------------------------------------------------------------

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) =>
    prop !== "isCollapse" && prop !== "isOffset" && prop !== "verticalLayout",
})<{ isCollapse: boolean; isOffset: boolean; verticalLayout: boolean }>(
  ({ isCollapse, isOffset, verticalLayout, theme }) => ({
    ...cssStyles(theme).bgBlur(),
    boxShadow: "none",
    height: HEADER.MOBILE_HEIGHT,
    zIndex: theme.zIndex.appBar + 1,
    transition: theme.transitions.create(["width", "height"], {
      duration: theme.transitions.duration.shorter,
    }),
    [theme.breakpoints.up("lg")]: {
      height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
      width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
      ...(isCollapse && {
        width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
      }),
      ...(isOffset && {
        height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      }),
      ...(verticalLayout && {
        width: "100%",
        height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
        backgroundColor: theme.palette.background.default,
      }),
    },
  })
);

// ----------------------------------------------------------------------


export default function DashboardHeader({
  onOpenSidebar,
  isCollapse = false,
  verticalLayout = false,
}: {
  onOpenSidebar: () => void;
  isCollapse?: boolean;
  verticalLayout?: boolean;
}) {
  const isOffset =
    useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;

  const isDesktop = useResponsive("up", "lg");

  return (
    <RootStyle
      isCollapse={isCollapse}
      isOffset={isOffset}
      verticalLayout={verticalLayout}
    >
      <Toolbar
        sx={{
          minHeight: "100% !important",
          px: { lg: 5 },
        }}
      >
        {isDesktop && verticalLayout && <Logo sx={{ mr: 2.5 }} />}

        {!isDesktop && (
          <IconButtonAnimate
            onClick={onOpenSidebar}
            sx={{ mr: 1, color: "text.primary" }}
          >
            <Iconify icon="eva:menu-2-fill" />
          </IconButtonAnimate>
        )}

        <Box sx={{ flexGrow: 1 }} />
        <AccountPopover />
      </Toolbar>
    </RootStyle>
  );
}
