import { Box, Card, CardActionArea, styled, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";

import Iconify from "../../components/Iconify";
import { OrgChart } from "d3-org-chart";

declare global {
  interface Document {
    webkitIsFullScreen: boolean;
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    mozFullScreen?: Element;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
  }

  interface HTMLElement {
    msRequestFullscreen?: () => Promise<void>;
    mozRequestFullScreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
  }
}

const GenealogyToolbar = ({ chart }: { chart: OrgChart<any>  }) => {
  const [fullscreen, setFullscreen] = useState(false);

  const SCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.neutral,
    marginBottom: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    "& svg": {
      height: "1.5rem",
      width: "1.5rem",
    },
  }));

  const SCardActionArea = styled(CardActionArea)(({ theme }) => ({
    padding: theme.spacing(1),
  }));

  const handleExpand = () => {
    chart.expandAll();
  };
  const handleFit = () => {
    chart.fit();
  };
  const handleZoomIn = () => {
    chart.zoomIn();
  };
  const handleZoomOut = () => {
    chart.zoomOut();
  };

  const handleFullScreen = () => {
    const fullScreenElement = document.querySelector(
      "#genealogyChartContainer"
    ) as HTMLElement;
    document.fullscreenElement == fullScreenElement ||
    document.webkitFullscreenElement == fullScreenElement ||
    document.mozFullScreenElement == fullScreenElement ||
    document.msFullscreenElement == fullScreenElement
      ? (document.exitFullscreen
          ? document.exitFullscreen()
          : document.mozCancelFullScreen
          ? document.mozCancelFullScreen()
          : document.webkitExitFullscreen
          ? document.webkitExitFullscreen()
          : document.msExitFullscreen && document.msExitFullscreen(),
        setFullscreen(false))
      : (fullScreenElement.requestFullscreen
          ? fullScreenElement.requestFullscreen()
          : fullScreenElement?.mozRequestFullScreen
          ? fullScreenElement.mozRequestFullScreen()
          : fullScreenElement.webkitRequestFullscreen
          ? fullScreenElement.webkitRequestFullscreen()
          : fullScreenElement.msRequestFullscreen &&
            fullScreenElement.msRequestFullscreen(),
        setFullscreen(true));
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
    document.addEventListener("mozfullscreenchange", exitHandler);
    document.addEventListener("MSFullscreenChange", exitHandler);
    document.addEventListener("webkitfullscreenchange", exitHandler);
    return () => {
      document.removeEventListener("fullscreenchange", exitHandler);
      document.removeEventListener("mozfullscreenchange", exitHandler);
      document.removeEventListener("MSFullscreenChange", exitHandler);
      document.removeEventListener("webkitfullscreenchange", exitHandler);
    };
  }, []);

  return (
    <Box sx={{ position: "absolute", right: 0, bottom: 0, mr: 1 }}>
      <SCard sx={{ background: "palette.background.neutral" }}>
        <Tooltip title="Expand all nodes">
          <SCardActionArea>
            <Iconify onClick={handleExpand} icon="gridicons:fullscreen" />
          </SCardActionArea>
        </Tooltip>
      </SCard>
      <SCard>
        <Tooltip title="Center nodes">
          <SCardActionArea>
            <Iconify
              onClick={handleFit}
              icon="ant-design:fullscreen-exit-outlined"
            />
          </SCardActionArea>
        </Tooltip>
      </SCard>
      <SCard>
        <Tooltip title="Zoom in">
          <SCardActionArea>
            <Iconify onClick={handleZoomIn} icon="ic:round-plus" />
          </SCardActionArea>
        </Tooltip>
      </SCard>
      <SCard>
        <Tooltip title="Zoom out">
          <SCardActionArea>
            <Iconify onClick={handleZoomOut} icon="ic:twotone-minus" />
          </SCardActionArea>
        </Tooltip>
      </SCard>
      {!fullscreen ? (
        <SCard>
          <Tooltip title="Fullscreen">
            <SCardActionArea>
              <Iconify
                onClick={handleFullScreen}
                icon="mingcute:fullscreen-2-line"
              />
            </SCardActionArea>
          </Tooltip>
        </SCard>
      ) : (
        <SCard>
          <Tooltip title="Cancel Fullscreen">
            <SCardActionArea>
              <Iconify
                onClick={handleFullScreen}
                icon="material-symbols:close-fullscreen-rounded"
              />
            </SCardActionArea>
          </Tooltip>
        </SCard>
      )}
    </Box>
  );
};

export default GenealogyToolbar;
