// @mui
import { Box, Card, Container, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
// hooks
import useResponsive from "../../hooks/useResponsive";
// components
import Image from "../../components/Image";
import Logo from "../../components/Logo";
import Page from "../../components/Page";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageSrc from "../../assets/images/illustration_login.png";
import useAuth from "../../hooks/useAuth";
import APP_PATH from "../../routes/paths";
import LoginForm, { LoginFormValues } from "./LoginForm";
import LoginVerifyCode from "./LoginVerifyCode";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
  const mdUp = useResponsive("up", "md");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loginData, setLoginData] = useState<LoginFormValues>(
    {} as LoginFormValues
  );
  const onSuccess = (email: string, data: LoginFormValues) => {
    setEmail(email);
    setLoginData(data);
    setStep(2);
  };
  useEffect(() => {
    isAuthenticated && navigate(APP_PATH.dashboard, { replace: true });
  }, [isAuthenticated]);

  return (
    <Page title="Login">
      <RootStyle>
        <HeaderStyle>
          <Logo />
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back
            </Typography>
            <Image
              visibleByDefault
              disabledEffect
              alt="login"
              isLocal
              src={ImageSrc}
            />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
              <Box sx={{ flexGrow: 1, textAlign: "center" }}>
                <Typography color={"primary.main"} variant="h1" gutterBottom>
                  Welcome Back
                </Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Login to your account.
                </Typography>
              </Box>
            </Stack>
            {step === 1 ? (
              <LoginForm onSuccess={onSuccess} />
            ) : (
              <LoginVerifyCode email={email} loginData={loginData} />
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
