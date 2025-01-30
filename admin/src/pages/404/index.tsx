import React from "react";
// components
import Page from "../../components/Page";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";

export default function () {
  return (
    <Page title="Profile">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs heading="Profile" links={[{ name: "Dashboard" }, { name: "Profile" }]} />
      {/* Breadcrumb End */}
    </Page>
  );
}
