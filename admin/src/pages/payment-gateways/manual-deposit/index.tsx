
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import ManualDeposit from "./ManualDeposit";

export default function () {
  return (
    <Page title="Manual Deposit Setting">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Manual Deposit Setting"
        links={[{ name: "Payment Gateways" }, { name: "Manual Deposit" }]}
      />
      {/* Breadcrumb End */}

      <ManualDeposit />
    </Page>
  );
}
