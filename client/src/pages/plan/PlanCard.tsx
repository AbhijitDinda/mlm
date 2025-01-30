import {
  alpha,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import { useState } from "react";
import Iconify from "../../components/Iconify";
import { RouterOutput } from "../../trpc";
import { fCurrency } from "../../utils/formatNumber";
import ReactivationDialog from "./ReactivationDialog";

// ----------------------------------------------------------------------

type PlanCardType = NonNullable<RouterOutput["plan"]["list"]>;
export type Reactivation = PlanCardType["reactivation"];

const PlanCard = ({
  name,
  dailyPairCapping,
  price,
  referralIncome,
  pairIncome,
  indirectReward,
  dailyIndirectRewardCapping,
  reactivation,
}: PlanCardType) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Card
      sx={{
        color: "#fff",
        background: (theme) =>
          theme.palette.mode === "light"
            ? "#374bff"
            : "linear-gradient(180deg,#374bff 5.21%,rgba(55,75,255,.42) 92.19%)",
        border: "none",
        boxShadow: "-24px 30px 121px 30px rgba(55,75,255,.29)",
      }}
    >
      <CardContent>
        <Stack sx={{ p: 1 }} spacing={3}>
          <Stack direction="row" alignItems="center" gap={1}>
            <Typography color="#fff" variant="h4">
              {name}
            </Typography>
            <Box sx={{ display: "inline" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  px: 1,
                  py: 0.5,
                  borderRadius: 0.6,
                  fontSize: 14,
                  background: (theme) => alpha(theme.palette.grey[100], 0.1),
                  fontWeight: 500,
                }}
              >
                <Iconify
                  sx={{ mr: 0.5, fontSize: 18 }}
                  icon="humbleicons:crown"
                />{" "}
                Popular
              </Box>
            </Box>
          </Stack>

          <Typography color={"#fff"} variant="h2">
            {fCurrency(price)}
          </Typography>
          <Box>
            <Stack spacing={4}>
              <Row label="Referral Income" value={fCurrency(referralIncome)} />
              <Row label="Pair Income" value={fCurrency(pairIncome)} />
              <Row label="Daily Pair Capping" value={dailyPairCapping} />
              <Row label="Indirect Reward" value={fCurrency(indirectReward)} />
              <Row
                label="Daily Indirect Reward Capping"
                value={dailyIndirectRewardCapping}
              />
              <Stack
                direction="row"
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Stack direction="row" gap={1} alignItems="center">
                  <Iconify
                    icon={"eva:checkmark-fill"}
                    sx={{ color: "primary.main", width: 20, height: 20 }}
                  />
                  <Typography variant="subtitle1">Reactivation</Typography>
                </Stack>
                <Typography
                  role="button"
                  sx={{ cursor: "pointer" }}
                  variant="subtitle1"
                  onClick={handleOpen}
                >
                  Click
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Stack>
        <ReactivationDialog
          open={open}
          handleClose={handleClose}
          reactivation={reactivation}
        />
      </CardContent>
    </Card>
  );
};

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <Stack direction="row" justifyContent={"space-between"} alignItems="center">
      <Stack direction="row" gap={1} alignItems="center">
        <Iconify
          icon={"eva:checkmark-fill"}
          sx={{ color: "primary.main", width: 20, height: 20 }}
        />
        <Typography variant="subtitle1">{label}</Typography>
      </Stack>
      <Typography variant="subtitle1">{value}</Typography>
    </Stack>
  );
}

export default PlanCard;
