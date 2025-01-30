import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Iconify from "../../components/Iconify";
import Page from "../../components/Page";
import APP_PATH from "../../routes/paths";
import SupportTicketList from "./SupportTicketList";

const Support = () => {
  return (
    <Page title="Support">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Support"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Support" },
        ]}
        action={
          <Button
            component={RouterLink}
            to={APP_PATH.support.create}
            size="large"
            startIcon={<Iconify icon="ic:round-plus" />}
            variant="contained"
          >
            Create a ticket
          </Button>
        }
      />
      {/* Breadcrumb End */}

      <SupportTicketList />
    </Page>
  );
};

export default Support;
