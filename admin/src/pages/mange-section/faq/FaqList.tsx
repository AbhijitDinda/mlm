import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Iconify from "../../../components/Iconify";
import { trpc } from "../../../trpc";
import FaqAction from "./FaqAction";
import FaqCreateDialog from "./FaqCreateDialog";

const FaqList = () => {
  const { data, isLoading } = trpc.faq.list.useQuery();
  const faqs = data ?? [];

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box>
      {isLoading && <LinearProgress />}
      <Stack spacing={4} alignItems="flex-end">
        <Button onClick={handleOpen} color="primary">
          <Iconify
            sx={{ fontSize: 24, marginLeft: "auto" }}
            icon="carbon:add"
          />{" "}
          Create New
        </Button>
        <Box sx={{ width: 1 }}>
          {faqs.map(({ question, answer, _id }, index) => {
            return (
              <Accordion sx={{ width: 1 }} key={_id}>
                <Stack justifyContent="space-between" direction="row">
                  <AccordionSummary sx={{ flexGrow: 1 }}>
                    <Typography>
                      Q{index + 1}: {question}
                    </Typography>
                  </AccordionSummary>
                  <FaqAction question={question} answer={answer} _id={_id} />
                </Stack>
                <AccordionDetails>
                  <Typography>{answer} </Typography>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>

        {/* Dialog */}
        <FaqCreateDialog open={open} handleClose={handleClose} />
      </Stack>
    </Box>
  );
};

export default FaqList;
