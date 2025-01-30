import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

import {
  FormProvider,
  RHFTextField,
  RHFUploadMultiFile,
} from "../../components/hook-form";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";

interface FormValues {
  _id: string;
  message: string;
  files: string[];
}

const TicketForm = ({ _id }: { _id: string }) => {
  const utils = trpc.useContext();
  const navigate = useNavigate();

  const supportSchema = Yup.object().shape({
    message: Yup.string().required("Message is required"),
  });

  const defaultValues: FormValues = {
    _id,
    message: "",
    files: [],
  };

  const methods = useForm({
    resolver: yupResolver(supportSchema),
    defaultValues,
  });

  const { watch, getValues, setValue, handleSubmit } = methods;

  const { mutate, isLoading: isSubmitting } = trpc.support.reply.useMutation({
    onSuccess() {
      utils.support.list.invalidate();
      utils.support.get.invalidate(_id);
      utils.dashboard.cards.invalidate();
      navigate(APP_PATH.support.root);
    },
  });

  const onSubmit = (data: FormValues) => mutate(data);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack justifyContent="flex-end" spacing={3}>
        <RHFTextField
          multiline
          minRows={4}
          name="message"
          type="text"
          label="Message"
        />
        <Box>
          <Typography component="div" variant="body2" sx={{ mb: 2 }}>
            Add Files
            <Typography
              component={"span"}
              color="text.secondary"
              variant="body2"
            >
              (Maximum 5 Files)
            </Typography>
          </Typography>
          <RHFUploadMultiFile
            getValues={getValues}
            setValue={setValue}
            name="files"
            accept="all"
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Submit
          </LoadingButton>
        </Box>
      </Stack>
    </FormProvider>
  );
};
export default TicketForm;
