import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import Withdraw from "./Withdraw";

export default function () {
  return (
    <Page title="Withdraw Setting">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Withdraw Setting"
        links={[{ name: "Payment Gateways" }, { name: "Withdraw" }]}
      />
      {/* Breadcrumb End */}

      <Withdraw />
    </Page>
  );
}
