import { Box, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import useConfiguration from "../../hooks/useConfiguration";
import { APP_PATH } from "../../routes/paths";
import LoginForm, { LoginFormValues } from "./LoginForm";

const LoginMain = ({
  onSuccess,
}: {
  onSuccess: (email: string, data: LoginFormValues) => void;
}) => {
  const { appName } = useConfiguration();
  return (
    <>
      <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
        <Box sx={{ flexGrow: 1, textAlign: "center" }}>
          <Typography variant="h4" gutterBottom>
            Sign in to {appName}
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Enter your details below.
          </Typography>
        </Box>
      </Stack>
      <LoginForm onSuccess={onSuccess} />
      <Typography variant="body2" align="center" sx={{ mt: 3 }}>
        Don’t have an account?{"  "}
        <Link variant="subtitle2" component={RouterLink} to={APP_PATH.register}>
          Get started
        </Link>
      </Typography>
    </>
  );
};

export default LoginMain;
