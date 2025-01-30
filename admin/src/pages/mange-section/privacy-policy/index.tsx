import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import PrivacyPolicy from "./PrivacyPolicy";

export default function () {
  return (
    <Page title="Privacy Policy Page">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Privacy Policy Page"
        links={[{ name: "Manage Section" }, { name: "Privacy Policy Page" }]}
      />
      {/* Breadcrumb End */}

      <PrivacyPolicy />
    </Page>
  );
}
