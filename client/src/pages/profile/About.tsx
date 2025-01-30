import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { capitalCase } from "change-case";

import Label from "../../components/Label";
import { User } from "../../contexts/JWTContext";
import useAuth from "../../hooks/useAuth";
import useConfiguration from "../../hooks/useConfiguration";
import { RouterOutput, trpc } from "../../trpc";
import { fDateTime } from "../../utils/formatTime";
import AnimatedBox from "../../components/AnimatedBox";

const About = () => {
  const {
    siteConfiguration: { kycVerification },
  } = useConfiguration();

  const { user, updateKyc } = useAuth();
  if (!user) return null;
  const { kyc } = user;

  const { mutate, isLoading } = trpc.profile.verifyKyc.useMutation({
    onSuccess({ data }) {
      updateKyc(data);
    },
  });

  return (
      <Card>
        <Box sx={{ bgcolor: "background.neutral" }}>
          <CardHeader title="About" />
          <Divider />
        </Box>
        <ProfileDetailsCard user={user} />
        {["unverified", "rejected"].includes(kyc) && kycVerification && (
          <CardContent sx={{ py: 0 }}>
            <LoadingButton
              onClick={() => mutate()}
              loading={isLoading}
              sx={{ textTransform: "uppercase" }}
            >
              Verify Kyc
            </LoadingButton>
          </CardContent>
        )}
      </Card>
  );
};

type GenealogyUsers = RouterOutput["network"]["genealogy"];
type GenealogyUser = NonNullable<GenealogyUsers>[number];
export function ProfileDetailsCard({ user }: { user: GenealogyUser | User }) {
  const {
    userId,
    userName,
    email,
    createdAt,
    referralId,
    status,
    kyc,
    firstName,
    lastName,
    placementId,
    placementSide,
  } = user;
  return (
    <CardContent>
      <Stack spacing={2}>
        <Box>
          <Typography variant="subtitle2">Full Name</Typography>
          <Typography variant="body2" color="text.secondary">
            {firstName} {lastName}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">User Id</Typography>
          <Typography variant="body2" color="text.secondary">
            {userId}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Username</Typography>
          <Typography variant="body2" color="text.secondary">
            {userName}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Placement Id</Typography>
          <Typography variant="body2" color="text.secondary">
            {placementId}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Placement Side</Typography>
          <Typography variant="body2" color="text.secondary">
            {placementSide}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Email</Typography>
          <Typography variant="body2" color="text.secondary">
            {email}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Member Since</Typography>
          <Typography variant="body2" color="text.secondary">
            {fDateTime(createdAt)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Referral Id</Typography>
          <Typography variant="body2" color="error.main">
            {referralId}
          </Typography>
        </Box>
        <Box>
          <Typography variant="subtitle2">Status</Typography>
          <Label color={status === "active" ? "success" : "error"}>
            {capitalCase(status)}
          </Label>
        </Box>
        <Box>
          <Typography variant="subtitle2">Kyc</Typography>
          <Label
            color={
              (kyc === "approved" && "success") ||
              (kyc === "pending" && "warning") ||
              (kyc === "rejected" && "error") ||
              "info"
            }
          >
            {capitalCase(kyc)}
          </Label>
        </Box>
      </Stack>
    </CardContent>
  );
}

export default About;
