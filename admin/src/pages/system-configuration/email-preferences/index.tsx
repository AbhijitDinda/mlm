import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import EmailPreferences from "./EmailPreferences";

export default function () {
  return (
    <Page title="Email Preferences">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Email Preferences"
        links={[
          { name: "System Configuration" },
          { name: "Email Preferences" },
        ]}
      />
      {/* Breadcrumb End */}

      <EmailPreferences />
    </Page>
  );
}
