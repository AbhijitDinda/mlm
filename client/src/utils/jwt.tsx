import jwtDecode, { JwtPayload } from "jwt-decode";
// ----------------------------------------------------------------------

const isValidToken = (accessToken?: string) => {
  if (!accessToken) {
    return false;
  }
  const decoded = jwtDecode<JwtPayload>(accessToken);
  const currentTime = Date.now() / 1000;
  return decoded.exp ? decoded.exp > currentTime : false;
};

const setSession = (accessToken?: string) => {
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const getLoginToken = (bearer?: boolean) => {
  const token = window.localStorage.getItem("accessToken");
  return token ? (bearer ? `Bearer ${token}` : token) : undefined;
};
export { isValidToken, setSession };
