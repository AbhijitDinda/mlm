import {
  Box,
  Card,
  LinearProgress,
  styled,
  SwipeableDrawer,
} from "@mui/material";
import { OrgChart } from "d3-org-chart";
import { useEffect, useRef, useState } from "react";
import { renderToString } from "react-dom/server";

import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { REGISTER_PATH } from "../../config";
import { trpc } from "../../trpc";
import ProfileCover from "./DrawerProfile";
import GenealogyNode, { GenealogyNodeButton } from "./GenealogyNode";
import GenealogyToolbar from "./GenealogyToolbar";
import ProfileDetailsCard from "./ProfileDetailsCard";
import SearchAutoComplete from "./SearchAutoComplete";

const GenealogyContainer = styled(Card)(({ theme }) => ({
  "--primary": theme.palette.primary.main,
  "--neutral": theme.palette.background.neutral,
  "--box-shadow": theme.shadows[1],
  "--padding": theme.transitions.create("padding"),
  "--border-color": "rgb(97, 243, 243)",
  "--color": theme.palette.text.primary,
  "--font-family": theme.typography.fontFamily,
  flexGrow: 1,
}));

const Genealogy = () => {
  const { data: nodes, isLoading } = trpc.network.genealogy.useQuery(
    undefined,
    { staleTime: Infinity, refetchOnWindowFocus: false }
  );

  const d3Container = useRef(null);
  const node_width = 220;
  const node_height = 140;
  const [chart, setChart] = useState<OrgChart<any> | null>(null);
  const [isUserDrawerOPen, setIsUserDrawerOpen] = useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setIsUserDrawerOpen(open);
    };

  type User = NonNullable<typeof nodes>[number];
  const [drawerUserData, setDrawerUserData] = useState<User | null>(null);

  // We need to manipulate DOM
  useEffect(() => {
    if (nodes && d3Container.current) {
      if (!chart) {
        setChart(new OrgChart());
      } else {
        chart
          .container(d3Container.current)
          .data(nodes)
          .svgHeight(window.screen.height - 400)
          .data(nodes)
          .nodeHeight(() => node_height)
          .nodeWidth(() => {
            return node_width;
          })
          .childrenMargin(() => 50)
          .compactMarginBetween(() => 15)
          .compactMarginPair(() => 15)
          .neightbourMargin(() => 15)
          .siblingsMargin(() => 20)
          .buttonContent(({ node }) => {
            return renderToString(<GenealogyNodeButton node={node} />);
          })
          .nodeContent(function ({ data }, i, arr, state) {
            return renderToString(<GenealogyNode data={data} />);
          })
          .compact(false)
          .onNodeClick((nodeId) => {
            const nodeData = nodes.find((e) => e.id === nodeId);
            if (!nodeData) return;

            const { userId, isValid, parentId } = nodeData;

            if (isValid) {
              setDrawerUserData(nodeData);
              setIsUserDrawerOpen(!isUserDrawerOPen);
            } else {
              window.open(
                `${REGISTER_PATH}?referral_id=${userId}&placement_id=${parentId}`
              );
            }
          })
          .render();
      }
    }

    const exitHandler = () => {
      chart &&
        chart
          .svgHeight(
            document.fullscreenElement
              ? window.screen.height
              : window.screen.height - 400
          )
          .render();
    };

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
  }, [nodes, d3Container.current, chart]);

  return (
    <Page title="Genealogy" sx={{ display: "flex", flexDirection: "column" }}>
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs heading="Genealogy" links={[{ name: "Genealogy" }]} />
      {/* Breadcrumb End */}
      <SwipeableDrawer
        anchor="right"
        open={isUserDrawerOPen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box sx={{ width: { xs: 250, md: 400 } }}>
          {drawerUserData && (
            <>
              <ProfileCover
                avatar={drawerUserData.avatar}
                displayName={drawerUserData.displayName}
              />
              <ProfileDetailsCard user={drawerUserData} />
            </>
          )}
        </Box>
      </SwipeableDrawer>

      {isLoading && <LinearProgress />}
      <GenealogyContainer id="genealogyChartContainer">
        <SearchAutoComplete nodes={nodes} chart={chart} />
        <div ref={d3Container} id="treeOrgChart"></div>
        {chart && <GenealogyToolbar chart={chart} />}
      </GenealogyContainer>
    </Page>
  );
};

export default Genealogy;
