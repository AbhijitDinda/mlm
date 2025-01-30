import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";

import {
  FormProvider,
  RHFTextField,
  RHFUploadMultiFile,
} from "../../components/hook-form";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";

interface FormValues {
  _id?: string;
  isReply: boolean;
  subject: string;
  message: string;
  files: string[];
}

const TicketForm = ({ isReply, _id }: { isReply: boolean; _id?: string }) => {
  const utils = trpc.useContext();
  const navigate = useNavigate();

  const supportSchema = yup.object().shape({
    message: yup.string().required("Message is required"),
    subject: isReply
      ? yup.string()
      : yup.string().required("Subject is required"),
  });

  const defaultValues: FormValues = {
    _id,
    isReply,
    subject: "",
    message: "",
    files: [],
  };

  const methods = useForm({
    resolver: yupResolver(supportSchema),
    defaultValues,
  });

  const { mutate, isLoading: isSubmitting } =
    trpc.support.createTicket.useMutation({
      onSuccess() {
        utils.support.list.invalidate();
        _id && utils.support.getTicket.invalidate(_id);
        navigate(APP_PATH.support.root);
      },
    });

  const { watch, getValues, setValue, handleSubmit } = methods;
  const onSubmit = (data: FormValues) => mutate(data);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack justifyContent="flex-end" spacing={3}>
        {!isReply && (
          <RHFTextField name="subject" type="text" label="Subject" />
        )}
        <RHFTextField
          multiline
          minRows={4}
          name="message"
          type="text"
          label="Message "
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
            setValue={setValue}
            getValues={getValues}
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
