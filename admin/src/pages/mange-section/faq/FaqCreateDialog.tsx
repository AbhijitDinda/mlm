import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack
} from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import FormProvider from "../../../components/hook-form/FormProvider";
import RHFTextField from "../../../components/hook-form/RHFTextField";
import { trpc } from "../../../trpc";

interface FormValues {
  _id?: string;
  question: string;
  answer: string;
}

const FaqCreateDialog = ({
  question = "",
  answer = "",
  _id = "",
  open,
  handleClose,
}: {
  question?: string;
  answer?: string;
  _id?: string;
  open: boolean;
  handleClose: () => void;
}) => {
  const utils = trpc.useContext();
  const defaultValues = {
    _id,
    question,
    answer,
  };
  const isEditing = !!_id;

  const validationSchema = yup.object().shape({
    question: yup.string().required("Question is required"),
    answer: yup.string().required("Answer is required"),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { reset, handleSubmit } = methods;
  const { mutate, isLoading: isSubmitting } = trpc.faq.create.useMutation({
    onSuccess({ data }) {
      utils.faq.list.setData(undefined, (lists) => {
        if (!lists) return [data];
        const index = lists.findIndex((item) => item._id === data._id);
        if (index !== -1) {
          return lists.map((list) => (list._id === data._id ? data : list));
        } else {
          return [...lists, data];
        }
      });
      reset();
      handleClose();
    },
  });
  const onSubmit = (formData: FormValues) => mutate(formData);

  return (
    <Dialog open={open} onClose={handleClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEditing ? "Update Faq" : "Create New Faq"}</DialogTitle>
        <DialogContent sx={{ minWidth: { md: 500 } }}>
          <Stack spacing={4} py={2}>
            <RHFTextField fullWidth name="question" label="Question" />
            <RHFTextField
              fullWidth
              multiline
              minRows={4}
              name="answer"
              label="Answer"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CANCEL</Button>
          <LoadingButton type="submit" loading={isSubmitting}>
            SUBMIT
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default FaqCreateDialog;
