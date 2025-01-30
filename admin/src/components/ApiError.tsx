import Page400 from "../pages/Page400";
import Page404 from "../pages/Page404";
import Page500 from "../pages/Page500";
import { isTRPCClientError } from "../trpc";

const ApiError = ({ error }: { error: any }) => {
  if (!isTRPCClientError(error)) {
    return <Page500 />;
  }
  const statusCode = error?.data?.httpStatus;
  if (statusCode === 404) return <Page404 isDashboard />;
  if (statusCode === 400) return <Page400 message={error?.message} />;
  return <Page500 />;
};
export default ApiError;
