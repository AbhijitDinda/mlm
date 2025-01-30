import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import JoiningTable from "./JoiningTable";

export default function () {
  return (
    <Page title="Joining">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Joining"
        links={[{ name: "Reports" }, { name: "Joining" }]}
      />
      {/* Breadcrumb End */}

      <JoiningTable />
    </Page>
  );
}
