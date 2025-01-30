import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from "@mui/material";
import EPinGenerate from "./EPinGenerate";
import EPinTransfer from "./EPinTransfer";

const EPinSummary = ({
  totalEPins,
  activeEPins,
  transferredEPins,
  expiredEPins,
}: {
  totalEPins: number;
  activeEPins: number;
  transferredEPins: number;
  expiredEPins: number;
}) => {
  return (
    <Card>
      <CardHeader sx={{ pb: 0 }} title="E-Pins Summary" />
      <CardContent>
        <Stack spacing={2}>
          <Row label="Total E-Pins Created" value={totalEPins} />
          <Row label="Active E-Pins" value={activeEPins} />
          <Row label="Transferred E-Pins" value={transferredEPins} />
          <Row label="Expired E-Pins" value={expiredEPins} />
        </Stack>
        <Box sx={{ mt: 4 }}>
          <Stack spacing={2}>
            <EPinGenerate />
            <EPinTransfer />
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};

function Row({ label, value }: { label: string; value: number }) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}

export default EPinSummary;
