import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import APP_PATH from "../../routes/paths";
import TransactionHistory from "./TransactionHistory";

const Transaction = () => {
  return (
    <Page title="Transaction">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Transaction"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Transaction" },
        ]}
      />
      {/* Breadcrumb End */}

      <TransactionHistory />
    </Page>
  );
};

export default Transaction;
