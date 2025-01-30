import { Alert, AlertTitle, Grid } from "@mui/material";
import AnimatedBox from "../../components/AnimatedBox";
import { AnimatedProvider } from "../../components/Page";
import useAnimated from "../../hooks/useAnimated";
import useAuth from "../../hooks/useAuth";
import { trpc } from "../../trpc";
import { fCurrency } from "../../utils/formatNumber";

const ReactivationAlert = () => {
  const { user } = useAuth();
  const { data, isLoading, error } = trpc.dashboard.reactivation.useQuery();
  const { variants } = useAnimated();

  if (!user) return null;
  const { isPremium } = user;
  const { payableAmount, reactivationLevel, wallet } = data! ?? {};

  return isPremium || isLoading || error ? null : (
    <Grid item xs={12}>
      <AnimatedProvider variants={variants}>
        <AnimatedBox>
          <Alert severity="error" variant="filled">
            <AlertTitle>Reactivation Required</AlertTitle>
            {fCurrency(payableAmount)} is required for reactivation to level{" "}
            {reactivationLevel + 1} but you have only {fCurrency(wallet)} in
            your wallet. You have to deposit {fCurrency(payableAmount - wallet)} to
            complete the reactivation.
          </Alert>
        </AnimatedBox>
      </AnimatedProvider>
    </Grid>
  );
};
export default ReactivationAlert;
