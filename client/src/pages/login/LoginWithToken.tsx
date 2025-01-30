import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import APP_PATH from "../../routes/paths";

const LoginWithToken = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { token } = params;
  if (token) {
    const accessToken = token.replaceAll("__", ".");
    window.localStorage.setItem("accessToken", accessToken);
  }
  useEffect(() => {
    window.location.replace(APP_PATH.dashboard);
  }, []);
  return <></>;
};

export default LoginWithToken;
