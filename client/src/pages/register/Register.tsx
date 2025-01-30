import { Container } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useContext } from "react";

import Page from "../../components/Page";
import LogoOnlyLayout from "../../layouts/LogoOnlyLayout";
import { RegisterContext, RegisterProvider } from "./RegisterProvider";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 900,
  margin: "auto",
  display: "flex",
  minHeight: "100vh",
  flexDirection: "column",
  justifyContent: "center",
}));

// ----------------------------------------------------------------------

const Register = () => {
  const { step } = useContext(RegisterContext);
  return (
    <Page title="Register">
      <RootStyle>
        <LogoOnlyLayout />
        <Container sx={{ p: 0 }}>
          <ContentStyle>
            <RegisterProvider />
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
};

export default Register;
