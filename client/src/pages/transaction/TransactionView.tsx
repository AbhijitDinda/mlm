import { LinearProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import ApiError from "../../components/ApiError";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import DepositTransaction from "../deposit-system/DepositTransaction";
import WithdrawTransaction from "../withdraw-system/WithdrawTransaction";

const Transaction = () => {
  const params = useParams();
  const { id: transactionId } = params;
  if (!transactionId) return null;

  const { data, isLoading, error } =
    trpc.transaction.getData.useQuery(transactionId);
  const { category } = data! ?? {};

  if (error) return <ApiError error={error} />;

  return (
    <Page title={`Transaction #${transactionId}`}>
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading={`Transaction View`}
        links={[
          { name: "Transaction", href: `${APP_PATH.transaction.root}` },
          { name: `Transaction #${transactionId}` },
        ]}
      />
      {/* Breadcrumb End */}

      {isLoading ? (
        <LinearProgress />
      ) : (
        <>
          {category === "deposit" && <DepositTransaction breadcrumb={false} />}
          {category === "withdraw" && (
            <WithdrawTransaction breadcrumb={false} />
          )}
        </>
      )}
    </Page>
  );
};
export default Transaction;
