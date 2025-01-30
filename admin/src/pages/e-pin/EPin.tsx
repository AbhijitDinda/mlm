import { Grid } from "@mui/material";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { RESPONSIVE_GAP } from "../../config";
import { trpc } from "../../trpc";
import EPinsList from "./EPinsList";
import EPinSummary from "./EPinSummary";
import EPinTransferHistory from "./EPinTransferHistory";
import TransferEPinOverview from "./TransferEPinOverview";

const EPin = () => {
  const { data, isLoading } = trpc.ePin.summary.useQuery();
  const {
    totalEPins,
    activeEPins,
    transferredEPins,
    expiredEPins,
    transferredSummary: { active, expired },
  } = data! ?? { transferredSummary: { active: 0, expired: 0 } };

  return (
    <Page title="E-Pin">
      <HeaderBreadcrumbs heading="E-Pins" links={[{ name: "E-Pins" }]} />
      <Grid container spacing={RESPONSIVE_GAP}>
        <Grid item xs={12} md={6}>
          <TransferEPinOverview
            active={active}
            expired={expired}
            loading={isLoading}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <EPinSummary
            totalEPins={totalEPins}
            activeEPins={activeEPins}
            transferredEPins={transferredEPins}
            expiredEPins={expiredEPins}
          />
        </Grid>
        <Grid item xs={12}>
          <EPinsList />
        </Grid>
        <Grid item xs={12}>
          <EPinTransferHistory />
        </Grid>
      </Grid>
    </Page>
  );
};

export default EPin;
