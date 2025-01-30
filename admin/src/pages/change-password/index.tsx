import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import ChangePassword from "./ChangePassword";

export default function () {
  return (
    <Page title="Change Password">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Change Password"
        links={[{ name: "Change Password" }]}
      />
      {/* Breadcrumb End */}

      <ChangePassword />
    </Page>
  );
}
