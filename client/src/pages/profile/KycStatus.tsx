import { Alert, AlertTitle } from "@mui/material";
import useAuth from "../../hooks/useAuth";

const ProfileKycStatus = () => {
  const { user } = useAuth();
  if (!user) return null;
  const { kyc, lastKyc: _lasKyc } = user;
  const lastKyc = _lasKyc ?? { status: "", message: "" };
  return kyc === "rejected" ? (
    <Alert sx={{ mb: 2 }} severity="error">
      <AlertTitle>Kyc Rejected</AlertTitle>
      {lastKyc.message}
    </Alert>
  ) : null;
};

export default ProfileKycStatus;
