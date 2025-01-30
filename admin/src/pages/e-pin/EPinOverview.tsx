import {
  Card,
  CardHeader,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";
import { fPercent } from "../../utils/formatNumber";

const getPercent = (value: number, total: number) => {
  if (!total || !value) return 0;
  return (value / total) * 100;
};

const EPinOverview = ({
  standardEPins = 0,
  premiumEPins = 0,
  totalEPins = 0,
}) => {
  return (
    <Card>
      <CardHeader title="E-Pins Overview" />
      <Stack spacing={4} sx={{ p: 3 }}>
        <ProgressItem
          progress={{
            label: "Standard E-Pins",
            text: standardEPins,
            value: getPercent(standardEPins, totalEPins),
          }}
        />
        <ProgressItem
          progress={{
            label: "Premium E-Pins",
            text: premiumEPins,
            value: getPercent(premiumEPins, totalEPins),
          }}
        />
      </Stack>
    </Card>
  );
};

function ProgressItem({
  progress,
}: {
  progress: { label: string; text: number; value: number };
}) {
  return (
    <Stack spacing={1}>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          {progress.label}
        </Typography>
        <Typography variant="subtitle2">{progress.text}</Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          &nbsp;({fPercent(progress.value)})
        </Typography>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress.value}
        color={progress.label === "Standard E-Pins" ? "success" : "info"}
      />
    </Stack>
  );
}

export default EPinOverview;
