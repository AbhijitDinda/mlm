import { LoadingButton } from "@mui/lab";
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardHeader,
  Divider,
  LinearProgress,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useNavigate, useParams } from "react-router-dom";

import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Iconify from "../../components/Iconify";
import Page from "../../components/Page";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import { fDateTime } from "../../utils/formatTime";
import { MessageCard } from "./MessageCard";
import TicketForm from "./SupportTicketForm";

const Ticket = () => {
  const utils = trpc.useContext();
  const params = useParams();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const { id: ticketId } = params;
  if (!ticketId) return null;

  const { mutate: close, isLoading: isClosing } =
    trpc.support.close.useMutation({
      onSuccess() {
        utils.support.list.invalidate();
        utils.support.get.invalidate(ticketId);
        utils.dashboard.cards.invalidate();
        navigate(APP_PATH.support.root);
      },
    });

  const closeTicket = async () => {
    try {
      await confirm({ description: "Are you sure want to close this ticket?" });
      close(ticketId);
    } catch (error) {
      console.log("error->", error);
    }
  };

  const { data, isLoading } = trpc.support.get.useQuery(ticketId);
  const { status, updatedAt, closedBy, messages, pic } = data! ?? {};

  return isLoading ? (
    <LinearProgress />
  ) : (
    <Page title={`Ticket #${ticketId}`}>
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Support"
        links={[
          { name: "Support", href: `${APP_PATH.support.root}` },
          { name: `Ticket #${ticketId}` },
        ]}
        action={
          status === "closed" ? undefined : (
            <LoadingButton
              color="error"
              variant="contained"
              size="large"
              startIcon={<Iconify icon="jam:close-circle" />}
              onClick={closeTicket}
              loading={isClosing}
              loadingPosition="start"
            >
              {isClosing ? "Closing Ticket..." : "Close Ticket"}
            </LoadingButton>
          )
        }
      />
      {/* Breadcrumb End */}

      {/* body */}

      {status === "closed" ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          <AlertTitle>Ticket Closed</AlertTitle>
          This ticket was closed by {closedBy} at{" "}
          <strong>{fDateTime(updatedAt)}</strong>
        </Alert>
      ) : (
        <Card sx={{ mb: 4 }}>
          <Box sx={{ bgcolor: "background.neutral" }}>
            <CardHeader title="Add reply" />
            <Divider />
          </Box>
          <Box p={3}>
            <TicketForm _id={ticketId} />
          </Box>
        </Card>
      )}

      {[...messages]?.reverse().map((data, index) => {
        //@ts-ignore //todo
        return <MessageCard pic={pic} key={index} {...data} />;
      })}
    </Page>
  );
};

export default Ticket;
