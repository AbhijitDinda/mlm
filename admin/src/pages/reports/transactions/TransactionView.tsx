import { LinearProgress } from "@mui/material";
import { useParams } from "react-router-dom";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import APP_PATH from "../../../routes/paths";
import { trpc } from "../../../trpc";
import DepositTransaction from "../../deposit/DepositTransaction";
import WithdrawTransaction from "../../withdraw/WithdrawTransaction";

const TransactionView = () => {
  const params = useParams();
  const { id: transactionId } = params;
  if (!transactionId) return null;

  const { data, isLoading } = trpc.report.transaction.useQuery(transactionId);
  const { category } = data! ?? {};

  return (
    <Page title={`Transaction #${transactionId}`}>
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading={`Transaction View`}
        links={[
          { name: "Reports" },
          {
            name: "Transactions",
            href: `${APP_PATH.reports.transactions.root}`,
          },
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

export default TransactionView;
