import { useEffect, useState } from "react";
// @mui
import { alpha } from "@mui/material/styles";
import { Button } from "@mui/material";
// components
import Iconify from "../Iconify";

// ----------------------------------------------------------------------

export default function SettingFullscreen() {
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  function exitHandler() {
    if (
      !document.webkitIsFullScreen &&
      !document.mozFullScreen &&
      !document.msFullscreenElement
    ) {
      setFullscreen(false);
    }
  }

  useEffect(() => {
    document.addEventListener("fullscreenchange", exitHandler);
    return () => {
      document.removeEventListener("fullscreenchange", exitHandler);
    };
  }, []);
  return (
    <Button
      fullWidth
      size="large"
      variant="outlined"
      color={fullscreen ? "primary" : "inherit"}
      startIcon={
        <Iconify
          icon={fullscreen ? "ic:round-fullscreen-exit" : "ic:round-fullscreen"}
        />
      }
      onClick={toggleFullScreen}
      sx={{
        fontSize: 14,
        ...(fullscreen && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.selectedOpacity
            ),
        }),
      }}
    >
      {fullscreen ? "Exit Fullscreen" : "Fullscreen"}
    </Button>
  );
}
