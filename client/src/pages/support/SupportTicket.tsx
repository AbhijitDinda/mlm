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
import ApiError from "../../components/ApiError";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Iconify from "../../components/Iconify";
import Page from "../../components/Page";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";
import { fDateTime } from "../../utils/formatTime";
import { MessageCard } from "./MessageCard";
import TicketForm from "./SupportTicketForm";
import AnimatedBox from "../../components/AnimatedBox";

const Ticket = () => {
  const utils = trpc.useContext();
  const params = useParams();
  const confirm = useConfirm();
  const navigate = useNavigate();
  const { id: ticketId } = params;
  if (!ticketId) return null;

  const { mutate, isLoading: isDeleting } =
    trpc.support.closeTicket.useMutation({
      onSuccess: () => {
        utils.support.getTicket.invalidate(ticketId);
        utils.support.list.invalidate();
        navigate(APP_PATH.support.root);
      },
    });

  const closeTicket = async () => {
    try {
      await confirm({ description: "Are you sure want to close this ticket?" });
      mutate(ticketId);
    } catch (error) {
      console.log("closeTicket ~ error:", error);
    }
  };

  const { data, isLoading, error } = trpc.support.getTicket.useQuery(ticketId);
  if (isLoading) {
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  }

  if (error) return <ApiError error={error} />;
  const { status, updatedAt, closedBy, messages, pic } = data! ?? {};

  return (
    <Page title={`Ticket #${ticketId}`}>
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Support"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Support", href: APP_PATH.support.root },
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
              loading={isDeleting}
              loadingPosition="start"
            >
              {isDeleting ? "Closing Ticket..." : "Close Ticket"}
            </LoadingButton>
          )
        }
      />
      {/* Breadcrumb End */}

      {/* body */}

      {status === "closed" ? (
        <AnimatedBox>
          <Alert severity="error" sx={{ mb: 4 }}>
            <AlertTitle>Ticket Closed</AlertTitle>
            This ticket was closed by {closedBy} at{" "}
            <strong>{fDateTime(updatedAt)}</strong>
          </Alert>
        </AnimatedBox>
      ) : (
        <AnimatedBox>
          <Card sx={{ mb: 4 }}>
            <Box sx={{ bgcolor: "background.neutral" }}>
              <CardHeader title="Add reply" />
              <Divider />
            </Box>
            <Box p={3}>
              <TicketForm isReply _id={ticketId} />
            </Box>
          </Card>
        </AnimatedBox>
      )}

      {[...messages]?.reverse().map((data, index) => {
        //@ts-ignore //todo
        return <MessageCard pic={pic} key={index} {...data} />;
      })}
    </Page>
  );
};

export default Ticket;
