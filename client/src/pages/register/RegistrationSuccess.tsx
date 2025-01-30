import {
  Box,
  Button,
  Card,
  CardContent,
  Skeleton,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useParams } from "react-router-dom";
import Iconify from "../../components/Iconify";
import Page from "../../components/Page";
import useConfiguration from "../../hooks/useConfiguration";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import { fDateTime } from "../../utils/formatTime";

const RootStyle = styled("div")(({ theme }) => ({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

const Row = ({ label, value }: { label: string; value?: string | number }) => {
  return (
    <Stack direction="row" justifyContent="space-between" sx={{ py: 2 }}>
      <Typography color="grey.600" variant="subtitle1">
        {label}
      </Typography>
      <Typography>{value}</Typography>
    </Stack>
  );
};

const RegistrationSuccess = () => {
  const { appName } = useConfiguration();
  const params = useParams();
  const { userId } = params;
  if (!userId) return null;

  const { data, isLoading } = trpc.auth.newUser.useQuery({ userId });

  const { userName, email, referralId, placementId, placementSide, createdAt } =
    data ?? {};
  return (
    <Page title="Registration Successful">
      <RootStyle>
        <Card sx={{ width: 1, maxWidth: 450 }}>
          <CardContent>
            <Box textAlign="center">
              <Iconify
                sx={{ fontSize: 60 }}
                color="success.main"
                icon={"ic:round-check-circle"}
              />
            </Box>
            <Typography variant="h4" textAlign="center">
              Registration Successful
            </Typography>

            <Box sx={{ my: 3 }}>
              {isLoading && (
                <Stack spacing={3}>
                  {Array(6)
                    .fill(null)
                    .map((v, i) => (
                      <Skeleton
                        key={i}
                        variant="rectangular"
                        height={30}
                        sx={{ borderRadius: 1 }}
                      />
                    ))}
                </Stack>
              )}

              {!isLoading && (
                <>
                  <Row label={"User Id"} value={userId}></Row>
                  <Row label={"User Name"} value={userName}></Row>
                  <Row label={"Email"} value={email}></Row>
                  <Row label={"Referral Id"} value={referralId}></Row>
                  <Row label={"Placement Id"} value={placementId}></Row>
                  <Row label={"Placement Side"} value={placementSide}></Row>
                  <Row
                    label={"Registered At"}
                    value={fDateTime(createdAt!)}
                  ></Row>
                </>
              )}
            </Box>

            <Typography
              sx={{ mb: 3 }}
              color="text.secondary"
              textAlign="center"
            >
              Thanks for becoming a member of {appName}
            </Typography>

            <Button
              component={RouterLink}
              to={APP_PATH.home}
              size="large"
              variant="contained"
              fullWidth
            >
              Go To Home
            </Button>
          </CardContent>
        </Card>
      </RootStyle>
    </Page>
  );
};

export default RegistrationSuccess;
