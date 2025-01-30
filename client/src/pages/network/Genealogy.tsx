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
import ApiError from "../../components/ApiError";

import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import useAuth from "../../hooks/useAuth";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import { isObjEmpty } from "../../utils/fns";
import { ProfileDetailsCard } from "../profile/About";
import ProfileCover from "./DrawerProfile";
import GenealogyNode, { GenealogyNodeButton } from "./GenealogyNode";
import GenealogyToolbar from "./GenealogyToolbar";
import SearchAutoComplete from "./SearchAutoComplete";
import AnimatedBox from "../../components/AnimatedBox";

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
  const { user } = useAuth();
  const {
    data: nodes,
    isLoading,
    error,
  } = trpc.network.genealogy.useQuery(undefined, {
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
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

  const container = document.querySelector(
    "#genealogyChartContainer"
  ) as HTMLElement;

  // We need to manipulate DOM
  useEffect(() => {
    if (nodes && d3Container.current) {
      if (!chart) {
        setChart(new OrgChart());
      } else {
        chart
          .container(d3Container.current)
          .data(nodes)
          .svgHeight(container.offsetHeight)
          .data(nodes)
          .nodeHeight((d) => node_height)
          .nodeWidth((d) => {
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

            const { isValid, parentId, placementSide } = nodeData;

            if (isValid) {
              setDrawerUserData(nodeData);
              setIsUserDrawerOpen(!isUserDrawerOPen);
            } else {
              window.open(
                `${APP_PATH.register}?referral_id=${
                  user?.userId
                }&placement_id=${parentId}&placement=${
                  placementSide === "left" ? "left" : "right"
                }`
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

  if (error) return <ApiError error={error} />;

  return (
    <Page title="Genealogy" sx={{ display: "flex", flexDirection: "column" }}>
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Genealogy"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Genealogy" },
        ]}
      />
      {/* Breadcrumb End */}
      <SwipeableDrawer
        anchor="right"
        open={isUserDrawerOPen}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
      >
        <Box sx={{ width: { xs: 250, md: 400 } }}>
          {drawerUserData && !isObjEmpty(drawerUserData) && (
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

      <AnimatedBox sx={{ flexGrow: 1, display: "flex" }}>
        {isLoading && <LinearProgress />}
        <GenealogyContainer id="genealogyChartContainer">
          <SearchAutoComplete nodes={nodes} chart={chart} />
          <div ref={d3Container} id="treeOrgChart"></div>
          {chart && <GenealogyToolbar chart={chart} />}
        </GenealogyContainer>
      </AnimatedBox>
    </Page>
  );
};

export default Genealogy;
