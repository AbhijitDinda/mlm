import { Box, Card, CardHeader, Divider } from "@mui/material";

import AnimatedBox from "../../components/AnimatedBox";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import APP_PATH from "../../routes/paths";
import SupportTicketForm from "./SupportTicketForm";

const CreateTicket = () => {
  return (
    <Page title="Create ticket">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Create ticket"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Support", href: APP_PATH.support.root },
          { name: "Create ticket" },
        ]}
      />
      {/* Breadcrumb End */}

      {/* Form */}

      <AnimatedBox>
        <Card>
          <Box sx={{ bgcolor: "background.neutral" }}>
            <CardHeader title="Create ticket" />
            <Divider />
          </Box>
          <Box p={3}>
            <SupportTicketForm isReply={false} _id={undefined} />
          </Box>
        </Card>
      </AnimatedBox>
    </Page>
  );
};

export default CreateTicket;
