import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import TermsAndConditions from "./TermsAndConditions";

export default function () {
  return (
    <Page title="Terms And Conditions">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Terms And Conditions"
        links={[{ name: "Manage Section" }, { name: "Terms And Conditions" }]}
      />
      {/* Breadcrumb End */}

      <TermsAndConditions />
    </Page>
  );
}
