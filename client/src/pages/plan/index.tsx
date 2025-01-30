import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import APP_PATH from "../../routes/paths";
import Plan from "./Plan";

const _Plan = () => {
  return (
    <Page title="Plan">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Plan"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Plan" },
        ]}
      />
      <Plan />
    </Page>
  );
};
export default _Plan;
