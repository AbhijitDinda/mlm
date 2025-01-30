import { Grid } from "@mui/material";
import { RESPONSIVE_GAP } from "../../../config";
import { trpc } from "../../../trpc";
import { fCurrency } from "../../../utils/formatNumber";
import { InfoCard } from "../../dashboard/InfoCard";

const OrdersCards = () => {
  const { data, isLoading } = trpc.order.cards.useQuery();
  const { earning, totalSold, freeSold, premiumSold } = data! ?? {};

  return (
    <Grid container sx={{ mb: RESPONSIVE_GAP }} spacing={RESPONSIVE_GAP}>
      <InfoCard
        label="Total Sold"
        value={totalSold}
        icon="heroicons:user-group"
        loading={isLoading}
        color="primary"
      />
      <InfoCard
        label="Free Sold"
        value={freeSold}
        icon="icon-park-outline:people-left"
        color="secondary"
        loading={isLoading}
      />
      <InfoCard
        label="Premium Sold"
        value={premiumSold}
        icon="icon-park-outline:people-right"
        color="warning"
        loading={isLoading}
      />
      <InfoCard
        label="Earning"
        value={earning}
        icon="heroicons:user-group"
        color="error"
        loading={isLoading}
        format={fCurrency}
      />
    </Grid>
  );
};
export default OrdersCards;
