import {
  Card,
  CardHeader,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { fCurrency, fPercent } from "../../utils/formatNumber";

const getPercent = (amount: number, totalAmount: number) => {
  return (amount / totalAmount) * 100;
};

const TransferPaymentOverview = ({
  receivedAmount,
  transferredAmount,
  loading,
}: {
  receivedAmount: number;
  transferredAmount: number;
  loading: boolean;
}) => {
  const totalAmount = receivedAmount + transferredAmount;
  return (
    <Card>
      <CardHeader title="Transfer Payment Overview" />
      <Stack spacing={4} sx={{ p: 3 }}>
        <ProgressItem
          progress={{
            label: "Total Received",
            amount: receivedAmount,
            value: getPercent(receivedAmount, totalAmount),
          }}
        />
        <ProgressItem
          progress={{
            label: "Total Transferred",
            amount: transferredAmount,
            value: getPercent(transferredAmount, totalAmount),
          }}
        />
      </Stack>
    </Card>
  );
};

function ProgressItem({
  progress,
}: {
  progress: { label: string; amount: number; value: number };
}) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {progress.label}
        </Typography>
        <Typography variant="subtitle2">
          {fCurrency(progress.amount)}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          &nbsp;({fPercent(progress.value)})
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress.value}
        color={progress.label === "Total Received" ? "success" : "error"}
      />
    </Stack>
  );
}

export default TransferPaymentOverview;
