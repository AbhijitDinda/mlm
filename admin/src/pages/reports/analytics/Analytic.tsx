import { Grid } from "@mui/material";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import { RESPONSIVE_GAP } from "../../../config";
import { trpc } from "../../../trpc";
import AnalyticGraph from "./AnalyticGraph";

const Analytic = () => {
  return (
    <Page title="Analytics">
      <HeaderBreadcrumbs
        heading="Analytics"
        links={[{ name: "Reports" }, { name: "Analytics" }]}
      />

      <Grid container spacing={RESPONSIVE_GAP}>
        <Grid item xs={12}>
          <AnalyticGraph
            title={"Registrations"}
            query={trpc.report.analytics.registration.useQuery}
          />
        </Grid>
        <Grid item xs={12}>
          <AnalyticGraph
            title={"Deposits"}
            query={trpc.report.analytics.deposit.useQuery}
            isCurrency
          />
        </Grid>
        <Grid item xs={12}>
          <AnalyticGraph
            title={"Withdraw"}
            query={trpc.report.analytics.withdraw.useQuery}
            isCurrency
          />
        </Grid>
      </Grid>
    </Page>
  );
};

export default Analytic;
