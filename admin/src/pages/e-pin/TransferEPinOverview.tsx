import {
  Card,
  CardHeader,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { fCurrency, fPercent } from "../../utils/formatNumber";

const getPercent = (amount: number, total: number) => {
  return (amount / total) * 100;
};

const TransferEPinOverview = ({
  active,
  expired,
  loading,
}: {
  active: number;
  expired: number;
  loading: boolean;
}) => {
  const total = active + expired;
  return (
    <Card>
      <CardHeader title="Transfer E-Pins Overview" />
      <Stack spacing={4} sx={{ p: 3 }}>
        <ProgressItem
          progress={{
            label: "Active E-Pins",
            amount: active,
            value: getPercent(active, total),
          }}
        />
        <ProgressItem
          progress={{
            label: "Expired E-Pins",
            amount: expired,
            value: getPercent(expired, total),
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
        <Typography variant="subtitle2">{progress.amount}</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          &nbsp;({fPercent(progress.value)})
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress.value}
        color={progress.label === "Active E-Pins" ? "success" : "error"}
      />
    </Stack>
  );
}

export default TransferEPinOverview;
