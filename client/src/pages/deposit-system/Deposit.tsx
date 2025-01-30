import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { APP_PATH } from "../../routes/paths";
import ManualDeposit from "./ManualDeposit";

const Deposit = () => {
  return (
    <Page title="Deposit" animate={false}>
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Deposit"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Deposit" },
        ]}
      />
      {/* Breadcrumb End */}

      <ManualDeposit />
    </Page>
  );
};

export default Deposit;
