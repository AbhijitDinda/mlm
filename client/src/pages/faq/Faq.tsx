import { alpha, Box, Grid, LinearProgress, Paper, styled } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

import ApiError from "../../components/ApiError";
import Iconify from "../../components/Iconify";
import Label from "../../components/Label";
import Page from "../../components/Page";
import TitleText from "../../components/TitleText";
import { trpc } from "../../trpc";

const RootStyle = styled("div")(() => ({
  height: "100%",
}));

const Icon = styled(Box)(({ theme }) => ({
  width: 50,
  height: 50,
  borderRadius: theme.spacing(1),
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 32,
  padding: theme.spacing(1),
  background: alpha(theme.palette.primary.main, 0.1),
}));

export default function Faq() {
  const { isLoading, data, error } = trpc.home.frontend.useQuery();
  const { faq } = data! ?? {};
  const { title, subtitle } = faq ?? {};

  const res = trpc.home.faq.useQuery().data;
  const faqs = res ?? [];

  if (error) return <ApiError error={error} />;

  return (
    <Page title="Faq">
      <RootStyle>
        <Typography variant="h2" textAlign={"center"} mb={1}>
          <TitleText text={title} />
        </Typography>
        <Typography
          variant="body1"
          textAlign={"center"}
          color="text.secondary"
          mb={8}
        >
          <TitleText text={subtitle} />
        </Typography>

        <div>
          {isLoading && <LinearProgress />}
          {faqs.map(({ question, answer }, index) => {
            return (
              <Accordion key={index}>
                <AccordionSummary
                  expandIcon={
                    <Iconify icon="material-symbols:keyboard-arrow-down-rounded" />
                  }
                >
                  <Typography>
                    Q{index + 1}: {question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography color="text.secondary">{answer} </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </div>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 1,
            mt: 10,
          }}
        >
          <Label color="primary">Question</Label>
          <Typography variant="h4">You still have a question?</Typography>
          <Typography color={"grey.600"}>
            If you cannot find a question in our FAQ, you can always contact us.
            We will answer to you shortly!
          </Typography>
          <FaqContact />
        </Box>
      </RootStyle>
    </Page>
  );
}

function FaqContact() {
  const { isLoading, data } = trpc.home.frontend.useQuery();
  const { contactUs } = data ?? {};
  const { title, subtitle, whatsapp, email, location } = contactUs ?? {};

  return (
    <Grid container marginTop={4} spacing={4}>
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            cursor: "pointer",
            p: 6,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Icon>
            <Iconify color="primary.main" icon={"ic:baseline-whatsapp"} />
          </Icon>
          <Typography variant="h5">{whatsapp}</Typography>
          <Typography color="text.secondary">
            Best way to get answer faster!
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper
          sx={{
            cursor: "pointer",
            p: 6,
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Icon>
            <Iconify color="primary.main" icon={"carbon:email"} />
          </Icon>
          <Typography variant="h5">{email}</Typography>
          <Typography color="text.secondary">
            We are always happy to help!
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}
