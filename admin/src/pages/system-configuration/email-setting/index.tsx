import { Grid } from "@mui/material";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import EmailSettingCard from "./EmailSettingCard";
import SendTestEmail from "./SendTestEmailCard";

export default function () {
  return (
    <Page title="Email Setting">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Email Setting"
        links={[{ name: "System Configuration" }, { name: "Email Setting" }]}
      />
      {/* Breadcrumb End */}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <EmailSettingCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <SendTestEmail />
        </Grid>
      </Grid>
    </Page>
  );
}
