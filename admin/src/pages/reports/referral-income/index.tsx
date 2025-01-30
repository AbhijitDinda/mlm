import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import ReferralIncomeTable from "./ReferralIncomeTable";

export default function () {
  return (
    <Page title="Referral Income">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Referral Income"
        links={[{ name: "Reports" }, { name: "Referral Income" }]}
      />
      {/* Breadcrumb End */}

      <ReferralIncomeTable />
    </Page>
  );
}
