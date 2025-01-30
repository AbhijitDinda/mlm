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
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import Iconify from "../../../components/Iconify";
import useFormEdit from "../../../hooks/useFormEdit";
import IconifyIcons from "../../../IconifyIcons";
import { trpc } from "../../../trpc";

interface FormValues {
  title: string;
  subtitle: string;
  whatsapp: string;
  email: string;
  location: string;
}

const ContactUsForm = () => {
  const utils = trpc.useContext();
  const { data, isLoading } = trpc.manageSection.getContactUs.useQuery();
  const defaultValues = {
    title: "",
    subtitle: "",
    whatsapp: "",
    email: "",
    location: "",
  };

  const FormSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    subtitle: yup.string().required("Subtitle is required"),
    whatsapp: yup.string().required("Whatsapp is required"),
    email: yup.string().required("Email is required").email("Email is invalid"),
    location: yup.string(),
  });

  const methods = useForm({
    resolver: yupResolver(FormSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const { isEditing, startEditing, stopEditing } = useFormEdit();

  const { mutate, isLoading: isSubmitting } =
    trpc.manageSection.updateContactUs.useMutation({
      onSuccess(data, variables) {
        utils.manageSection.getContactUs.setData(undefined, variables);
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
        title="Contact Us"
        action={
          !isEditing ? (
            <IconButton onClick={startEditing}>
              <Iconify icon={IconifyIcons.pencil} />
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
            <RHFTextField
              disabled={!isEditing}
              name="whatsapp"
              type="text"
              label="Whatsapp"
            />
            <RHFTextField
              disabled={!isEditing}
              name="email"
              type="text"
              label="Email"
            />
            <RHFTextField
              disabled={!isEditing}
              name="location"
              type="text"
              label="Location"
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

export default ContactUsForm;
