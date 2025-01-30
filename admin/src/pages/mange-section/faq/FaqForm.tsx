import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Iconify from "../../../components/Iconify";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import useFormEdit from "../../../hooks/useFormEdit";
import { trpc } from "../../../trpc";

interface FormValues {
  _id?: string;
  title: string;
  subtitle: string;
}

const FaqForm = () => {
  const utils = trpc.useContext();
  const { data, isLoading } = trpc.manageSection.getFaq.useQuery();
  const defaultValues = {
    _id: undefined,
    title: "",
    subtitle: "",
  };

  const FormSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    subtitle: yup.string(),
  });

  const methods = useForm<FormValues>({
    resolver: yupResolver(FormSchema),
    defaultValues,
    mode: "all",
  });

  const { reset, handleSubmit } = methods;
  const { isEditing, startEditing, stopEditing } = useFormEdit();

  const { mutate, isLoading: isSubmitting } =
    trpc.manageSection.updateFaq.useMutation({
      onSuccess(data, variables) {
        utils.manageSection.getFaq.setData(undefined, variables);
        stopEditing();
      },
    });
  const onSubmit = (formData: FormValues) => mutate(formData);

  useEffect(() => {
    reset(data);
  }, [data]);

  return (
    <Card>
      {isLoading && <LinearProgress />}
      <CardHeader
        title="Faq Section"
        action={
          !isEditing ? (
            <IconButton onClick={startEditing}>
              <Iconify icon={"mdi:lead-pencil"} />
            </IconButton>
          ) : undefined
        }
      />
      <Divider />
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <RHFTextField
              disabled={!isEditing}
              name="title"
              type="text"
              label="Title"
            />
            <RHFTextField
              disabled={!isEditing}
              multiline
              minRows={4}
              name="subtitle"
              type="text"
              label="Subtitle"
            />
            {isEditing && (
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button size="large" onClick={stopEditing}>
                  Cancel
                </Button>
                <LoadingButton
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                >
                  Save Changes
                </LoadingButton>
              </Stack>
            )}
          </Stack>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default FaqForm;
