// components
import {
  Box,
  Button,
  Card,
  Divider,
  LinearProgress,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import EmptyContent from "../../components/EmptyContent";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Image from "../../components/Image";
import Page from "../../components/Page";
import { APP_PATH } from "../../routes/paths";
import { trpc } from "../../trpc";
import { fCurrency, fPercent } from "../../utils/formatNumber";

const Withdraw = () => {
  const { data, isLoading } = trpc.withdraw.getGatewaysList.useQuery();
  const gateways = data! ?? [];
  return (
    <Page title="Withdraw" animate={false}>
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Withdraw"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Withdraw" },
        ]}
      />
      {/* Breadcrumb End */}

      {isLoading && <LinearProgress />}
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
        {!gateways.length && !isLoading ? (
          <Card sx={{ height: 600 }} className="here">
            <EmptyContent
              title="No data available"
              description="You have not added any withdraw details"
              element={
                <Button
                  to={APP_PATH.withdrawSystem.methods}
                  component={RouterLink}
                  sx={{ mt: 2 }}
                  variant="contained"
                >
                  Add Withdraw Details
                </Button>
              }
            />
          </Card>
        ) : (
          gateways.map(
            ({
              _id,
              name,
              logo,
              processingTime,
              minWithdraw,
              maxWithdraw,
              charge,
              chargeType,
            }) => {
              return (
                <Card key={_id}>
                  <Box sx={{ position: "relative" }}>
                    <Image alt={name} src={logo} ratio="1/1" />
                  </Box>
                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Link
                      to={APP_PATH.withdrawSystem.withdrawPayment + "/" + _id}
                      color="inherit"
                      component={RouterLink}
                    >
                      <Typography
                        sx={{
                          textDecoration: "underline",
                          textTransform: "uppercase",
                        }}
                        color="primary.main"
                        textAlign={"center"}
                        variant="subtitle2"
                        noWrap
                      >
                        {name}
                      </Typography>
                    </Link>
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
                          {fCurrency(minWithdraw)}{" "}
                          <Box component={"span"} mx={0.3}>
                            -
                          </Box>{" "}
                          {fCurrency(maxWithdraw)}
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
    </Page>
  );
};

export default Withdraw;
