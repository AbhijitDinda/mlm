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
  Stack
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
  description: string;
}

const AboutUsSection = () => {
  const utils = trpc.useContext();
  const { isEditing, startEditing, stopEditing } = useFormEdit();
  const defaultValues = {
    description: "",
  };

  const validationSchema = yup.object().shape({
    description: yup.string().required("Description is required"),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { reset, setValue, handleSubmit } = methods;

  const { data, isLoading } = trpc.manageSection.getAboutUs.useQuery();

  const { mutate, isLoading: isSubmitting } =
    trpc.manageSection.updateAboutUs.useMutation({
      onSuccess(data, variables) {
        utils.manageSection.getAboutUs.setData(undefined, variables);
        stopEditing();
      },
    });
  const onSubmit = (formData: FormValues) => mutate(formData);

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  return (
    <Card>
      {isLoading && <LinearProgress />}
      <CardHeader
        title="Footer About Us"
        action={
          <>
            {!isEditing && (
              <IconButton onClick={startEditing}>
                <Iconify icon={IconifyIcons.pencil} />
              </IconButton>
            )}
          </>
        }
      />
      <Divider />
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <RHFTextField
              multiline
              minRows={4}
              disabled={!isEditing}
              name="description"
              label="Description"
            />
            {isEditing && (
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Button onClick={stopEditing} size="large" variant="outlined">
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
export default AboutUsSection;
