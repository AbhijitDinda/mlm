import { Card, Container, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ImageSrc from "../../assets/images/illustration_login.png";
import Image from "../../components/Image";
import Page from "../../components/Page";
import useAuth from "../../hooks/useAuth";
import useResponsive from "../../hooks/useResponsive";
import LogoOnlyLayout from "../../layouts/LogoOnlyLayout";
import { APP_PATH } from "../../routes/paths";
import { LoginFormValues } from "./LoginForm";
import LoginMain from "./LoginMain";
import LoginVerifyCode from "./LoginVerifyCode";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
  background: theme.palette.background.paper,
}));

const boxShadow = "0 1px 66.5px 3.5px rgba(0, 0, 0, 0.15)";
const ContentStyle = styled(Container)(({ theme }) => ({
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(12, 0),
}));

const LoginCardContainer = styled("div")(({ theme }) => ({
  maxWidth: 1000,
  position: "relative",
  [theme.breakpoints.up("md")]: {
    "&:before": {
      content: "''",
      width: 100,
      height: 100,
      background:
        "linear-gradient(109deg, rgba(131,64,255,0.76)  0%, rgba(32,77,204,0.76) 100%)",
      position: "absolute",
      right: -40,
      top: -20,
      borderRadius: theme.spacing(1),
      transform: "translateZ(-1px)",
    },
    "&:after": {
      content: "''",
      width: 80,
      height: 80,
      background:
        "linear-gradient(109deg, rgba(131,64,255,0.76)  0%, rgba(32,77,204,0.76) 100%)",
      position: "absolute",
      left: -40,
      bottom: -20,
      borderRadius: theme.spacing(1),
      transform: "translateZ(-1px)",
    },
  },
}));

const LoginCard = styled(Card)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    maxWidth: 1000,
  },
  margin: "auto",
  display: "flex",
  borderTopRightRadius: theme.spacing(1),
  borderBottomLeftRadius: theme.spacing(1),
  borderTopLeftRadius: theme.spacing(6),
  borderBottomRightRadius: theme.spacing(6),
  boxShadow: "none",
  [theme.breakpoints.up("md")]: {
    boxShadow,
  },
}));

const LeftCard = styled("div")(({ theme }) => ({
  background: theme.palette.primary.main,
}));

const RightCard = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: 420,
  // minWidth: 400,
  margin: "auto",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: theme.spacing(2),
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
        <LogoOnlyLayout />

        <ContentStyle>
          <LoginCardContainer>
            <LoginCard>
              {mdUp && (
                <LeftCard>
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
                </LeftCard>
              )}
              <RightCard>
                {step === 1 ? (
                  <LoginMain onSuccess={onSuccess} />
                ) : (
                  <LoginVerifyCode email={email} loginData={loginData} />
                )}
              </RightCard>
            </LoginCard>
          </LoginCardContainer>
        </ContentStyle>
      </RootStyle>
    </Page>
  );
}
