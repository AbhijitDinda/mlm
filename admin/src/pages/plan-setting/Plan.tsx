import { Button, Container, Grid, LinearProgress } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { MotionViewport } from "../../components/animate";
import { RESPONSIVE_GAP } from "../../config";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import PlanCard from "./PlanCard";

const Plan = () => {
  const { data, isLoading } = trpc.planSetting.getPlan.useQuery();
  return (
    <Page title="Plan Setting">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Plan Setting"
        links={[{ name: "Settings" }, { name: "Plan Setting" }]}
      />
      {/* Breadcrumb End */}

      {isLoading ? (
        <LinearProgress />
      ) : (
        <Container disableGutters component={MotionViewport}>
          <Grid container spacing={RESPONSIVE_GAP}>
            <Grid item xs={12} textAlign="right">
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to={APP_PATH.planSetting.create}
              >
                {data ? "Update" : "Create"}
              </Button>
            </Grid>

            {data && (
              <Grid item xs={12} md={4}>
                <PlanCard {...data} />
              </Grid>
            )}
          </Grid>
        </Container>
      )}
    </Page>
  );
};

export default Plan;
