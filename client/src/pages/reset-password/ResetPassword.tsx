import { Box, Container, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import { LockIcon, SentIcon } from "../../assets";
import Iconify from "../../components/Iconify";
import Page from "../../components/Page";
import LogoOnlyLayout from "../../layouts/LogoOnlyLayout";
import { APP_PATH } from "../../routes/paths";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100%",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
  background: theme.palette.background.paper,
}));

// ----------------------------------------------------------------------

const ResetPassword = () => {
  const [userData, setUserData] = useState({
    userId: "",
    email: "",
  });

  return (
    <Page title="Reset Password" sx={{ height: 1 }}>
      <RootStyle>
        <LogoOnlyLayout />

        <Container>
          <Box sx={{ maxWidth: 480, mx: "auto", textAlign: "center" }}>
            {!userData.userId ? (
              <>
                <LockIcon sx={{ mb: 5, mx: "auto", height: 96 }} />
                <Typography variant="h3" paragraph>
                  Forgot your password?
                </Typography>
                <Typography sx={{ color: "text.secondary", mb: 5 }}>
                  Please enter the <strong>User Id or Username</strong>{" "}
                  associated with your account and We will email you a link to
                  reset your password.
                </Typography>

                <ForgotPasswordForm onSent={(data) => setUserData(data)} />
              </>
            ) : (
              <Box>
                <SentIcon sx={{ mb: 5, mx: "auto", height: 160 }} />
                <Typography variant="h3" gutterBottom>
                  Request sent successfully
                </Typography>
                <Typography sx={{ color: "text.secondary", mb: 5 }}>
                  We've sent a 6-digit confirmation <b>code</b> to your email.
                  <br />
                  Please enter the <strong>code</strong> in below box to verify
                  your email.
                </Typography>

                <ResetPasswordForm userId={userData.userId} />
              </Box>
            )}

            <Link
              sx={{ alignItems: "center", display: "inline-flex", my: 3 }}
              variant="subtitle2"
              component={RouterLink}
              to={APP_PATH.login}
            >
              <Iconify
                sx={{ width: 16, height: 16 }}
                icon="eva:arrow-ios-back-fill"
              />
              Return to sign in
            </Link>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
};
export default ResetPassword;
