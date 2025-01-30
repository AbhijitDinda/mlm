import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import useConfiguration from "../../hooks/useConfiguration";
import { APP_PATH } from "../../routes/paths";
import RegisterForm from "./RegisterForm";

const MainRegistrationCard = () => {
  const {
    appName,
    siteConfiguration: { registration: isRegistrationEnabled },
  } = useConfiguration();
  return (
    <Card>
      <CardContent sx={{ p: { md: 6 } }}>
        {isRegistrationEnabled || (
          <Alert severity="error" sx={{ mb: 2 }}>
            <AlertTitle>Registration unavailable</AlertTitle>
            Currently registration is unavailable. Check back soon.
          </Alert>
        )}

        <Box
          sx={{
            mb: 5,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Get started absolutely free
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Create an account to continue with {appName}
          </Typography>
        </Box>
        <RegisterForm isRegistrationEnabled={isRegistrationEnabled} />
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "text.secondary", mt: 3 }}
        >
          By registering, I agree to &nbsp;
          <Link
            href={APP_PATH.termsAndCondition}
            underline="always"
            color="text.primary"
            target="_blank"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href={APP_PATH.privacyPolicy}
            underline="always"
            color="text.primary"
            target="_blank"
          >
            Privacy Policy
          </Link>
          .
        </Typography>

        <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
          Already have an account?{" "}
          <Link variant="subtitle2" to={APP_PATH.login} component={RouterLink}>
            Login
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MainRegistrationCard;
