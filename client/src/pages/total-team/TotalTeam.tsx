import React from "react";

import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import APP_PATH from "../../routes/paths";
import TotalTeamList from "./TotalTeamList";

const TotalTeam = () => {
  return (
    <Page title="Total Team">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Total Team"
        links={[{ name: "Dashboard", href: APP_PATH.dashboard }, { name: "Total Team" }]}
      />
      {/* Breadcrumb End */}

      <TotalTeamList />
    </Page>
  );
};

export default TotalTeam;
