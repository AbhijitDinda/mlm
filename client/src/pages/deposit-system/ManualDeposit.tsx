import {
  Box,
  Card,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import EmptyContent from "../../components/EmptyContent";
import Image from "../../components/Image";
import { trpc } from "../../trpc";
import { fCurrency, fPercent } from "../../utils/formatNumber";
import ManualDepositDialog from "./ManualDepositDialog";

const ManualDeposit = () => {
  const { data, isLoading } = trpc.manualDeposit.methods.useQuery();
  const gateways = data! ?? [];
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const handleDialogOpen = (gatewayId: string) => {
    setSelectedId(gatewayId);
    setOpen(true);
  };
  const handleDialogClose = () => setOpen(false);
  const selectedGatewayData = gateways.find(({ _id }) => _id === selectedId);

  return isLoading ? (
    <LinearProgress />
  ) : (
    <Box
      sx={{
        ...(gateways.length && {
          display: "grid",
          gap: 3,
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
        }),
      }}
    >
      {/* Dialog Start */}
      {open && selectedGatewayData && (
        <ManualDepositDialog
          selectedGatewayData={selectedGatewayData}
          selectedId={selectedId}
          open={open}
          onClose={handleDialogClose}
        />
      )}
      {/* Dialog end */}

      {!gateways.length ? (
        <Card sx={{ height: 600 }} className="here">
          <EmptyContent
            title="No data available"
            description="Currently no manual deposits are available"
          />
        </Card>
      ) : (
        gateways.map(
          ({
            _id,
            name,
            logo,
            processingTime,
            minDeposit,
            maxDeposit,
            charge,
            chargeType,
          }) => {
            return (
              <Card key={_id}>
                <Box sx={{ position: "relative" }}>
                  <Image alt={name} src={logo} ratio="1/1" />
                </Box>
                <Stack spacing={2} sx={{ p: 3 }}>
                  <Typography
                    sx={{
                      color: "inherit",
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                    textAlign={"center"}
                    variant="subtitle2"
                    noWrap
                    onClick={() => handleDialogOpen(_id)}
                  >
                    <Typography
                      sx={{ textDecoration: "underline", fontWeight: "bold" }}
                      component={"span"}
                      color="primary.main"
                    >
                      {name}
                    </Typography>
                  </Typography>
                  <Stack sx={{ color: "text.secondary" }} spacing={1}>
                    <Stack justifyContent={"space-between"} direction="row">
                      <Typography variant="subtitle2">Charge</Typography>
                      <Typography variant="subtitle2">
                        {chargeType === "fixed"
                          ? fCurrency(charge)
                          : fPercent(charge)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack justifyContent={"space-between"} direction="row">
                      <Typography variant="subtitle2">Limit</Typography>
                      <Typography variant="subtitle2">
                        {fCurrency(minDeposit)}{" "}
                        <Box component={"span"} mx={0.3}>
                          -
                        </Box>{" "}
                        {fCurrency(maxDeposit)}
                      </Typography>
                    </Stack>
                    <Divider />
                    <Stack justifyContent={"space-between"} direction="row">
                      <Typography variant="subtitle2">
                        Processing Time
                      </Typography>
                      <Typography variant="subtitle2">
                        {processingTime}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            );
          }
        )
      )}
    </Box>
  );
};

export default ManualDeposit;
