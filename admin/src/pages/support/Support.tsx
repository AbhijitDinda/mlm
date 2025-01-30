import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import SupportList from "./SupportList";

const Support = () => {
  return (
    <Page title="Support">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs heading="Support" links={[{ name: "Support" }]} />
      {/* Breadcrumb End */}

      <SupportList />
    </Page>
  );
};
export default Support;
