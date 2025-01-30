import { Box, Button, CardContent, Stack, Typography } from "@mui/material";
import { capitalCase } from "change-case";
import IconifyIcons from "../../IconifyIcons";
import Iconify from "../../components/Iconify";
import Label from "../../components/Label";
import { REGISTER_PATH } from "../../config";
import { User } from "../../contexts/JWTContext";
import { RouterOutput } from "../../trpc";
import { fDateTime } from "../../utils/formatTime";

type GenealogyUsers = RouterOutput["network"]["genealogy"];
type GenealogyUser = NonNullable<GenealogyUsers>[number];

const ProfileDetailsCard = ({
  user,
}: {
  user: Omit<User, "loginSessionId"> | GenealogyUser;
}) => {
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
  const canAddMember = "canAddMember" in user ? user.canAddMember : "no";

  let joinLink = `${REGISTER_PATH}?referral_id=${userId}`;
  if (canAddMember) joinLink += `&placement_id=${userId}`;

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
          <Typography variant="subtitle2">User ID</Typography>
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
        {canAddMember !== "no" && (
          <Box>
            <Button
              target="_blank"
              href={joinLink}
              startIcon={<Iconify icon={IconifyIcons.add} />}
            >
              Join Member
            </Button>
          </Box>
        )}
      </Stack>
    </CardContent>
  );
};

export default ProfileDetailsCard;
