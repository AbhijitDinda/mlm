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
import { useState } from "react";

import useAuth from "../../hooks/useAuth";
import { trpc } from "../../trpc";
import ProfileTwoFAModal from "./TwoFAModal";

const ProfileSecurityTwoFA = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  const { user } = useAuth();
  if (!user) return null;
  const { twoFA } = user;

  const { mutate, isLoading } = trpc.profile.twoFa.useMutation({
    onSuccess() {
      handleOpen();
    },
  });

  const setTwoFa = async () => mutate({ step: 1, status: twoFA });

  return (
    <Card>
      <ProfileTwoFAModal resend={setTwoFa} open={open} onClose={handleClose} />
      <CardHeader
        sx={{ bgcolor: "background.neutral" }}
        title="Two Factor Authentication"
      />
      <Divider />
      <CardContent>
        <Stack spacing={3}>
          <Typography>Secure Your Account</Typography>
          <Typography>
            Two-factor authentication adds an extra layer of security to your
            account. To log in, in addition you'll need to provide a 6 digit
            code
          </Typography>
          <Box>
            <LoadingButton
              loading={isLoading}
              color="error"
              variant="contained"
              onClick={setTwoFa}
            >
              {twoFA
                ? "Disable Two Factor Authentication"
                : "Enable Two Factor Authentication"}
            </LoadingButton>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileSecurityTwoFA;
