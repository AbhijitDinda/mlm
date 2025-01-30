// components
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  LinearProgress,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { Link as RouterLink } from "react-router-dom";
import EmptyContent from "../../components/EmptyContent";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Iconify from "../../components/Iconify";
import Image from "../../components/Image";
import Page from "../../components/Page";
import { APP_PATH } from "../../routes/paths";
import { trpc } from "../../trpc";
import { fCurrency, fPercent } from "../../utils/formatNumber";

const WithdrawMethods = () => {
  const confirm = useConfirm();

  const { data, isLoading } = trpc.withdraw.getGatewaysList.useQuery();
  const { data: user } = trpc.withdraw.getUserGatewayList.useQuery();
  const { mutate } = trpc.withdraw.deleteUserGateway.useMutation({
    onSuccess() {},
  });
  const gateways = data! ?? [];
  const userGateways = user! ?? [];

  const deleteUserWithdrawGateway = async (gatewayId: string, name: string) => {
    try {
      await confirm({ description: `Are you sure you want to delete ${name}` });
      mutate(gatewayId);
    } catch (error) {
      console.log("deleteUserWithdrawGateway ~ error:", error);
    }
  };

  return (
    <Page title="Withdraw Methods"  animate={false}>
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Withdraw Methods"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Withdraw Methods" },
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
        {!gateways.length ? (
          <Card sx={{ height: 600 }} className="here">
            <EmptyContent
              title="No data available"
              description="Current no withdraw methods are available"
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
              const isDetailsAdded =
                userGateways.length &&
                userGateways.find(({ _id: id }) => id === _id);

              return (
                <Card key={_id}>
                  <Box sx={{ position: "relative" }}>
                    <Image alt={name} src={logo} ratio="1/1" />
                  </Box>
                  <Stack spacing={2} sx={{ p: 3 }}>
                    <Link
                      component={RouterLink}
                      to={APP_PATH.withdrawSystem.addMethod + "/" + _id}
                      color="inherit"
                    >
                      <Typography
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
                    <Box>
                      {!isDetailsAdded ? (
                        <Button
                          component={RouterLink}
                          to={APP_PATH.withdrawSystem.addMethod + "/" + _id}
                          startIcon={<Iconify icon="carbon:add" />}
                          variant="contained"
                          fullWidth
                          size="large"
                          sx={{ mt: 1 }}
                        >
                          Add Details
                        </Button>
                      ) : (
                        <Stack justifyContent="flex-start" direction="row">
                          <IconButton
                            to={APP_PATH.withdrawSystem.addMethod + "/" + _id}
                            component={RouterLink}
                            color="success"
                          >
                            <Iconify icon="carbon:edit" />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteUserWithdrawGateway(_id, name)}
                            color="error"
                          >
                            <Iconify icon="carbon:delete" />
                          </IconButton>
                        </Stack>
                      )}
                    </Box>
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

export default WithdrawMethods;
