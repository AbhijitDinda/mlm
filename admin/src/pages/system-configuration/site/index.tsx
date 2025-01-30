import { Stack } from "@mui/material";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import SiteConfiguration from "./SiteConfiguration";
import SiteSetting from "./SiteSetting";

export default function () {
  return (
    <Page title="Site Setting">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Site Setting"
        links={[{ name: "System Configuration" }, { name: "Site Setting" }]}
      />
      {/* Breadcrumb End */}

      <Stack spacing={3}>
        <SiteSetting />
        <SiteConfiguration />
      </Stack>
    </Page>
  );
}
