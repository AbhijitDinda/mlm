import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import FormLabel from "../../../components/FormLabel";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import {
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
} from "../../../components/hook-form";
import Iconify from "../../../components/Iconify";
import Page from "../../../components/Page";
import useFormEdit from "../../../hooks/useFormEdit";
import IconifyIcons from "../../../IconifyIcons";
import { trpc } from "../../../trpc";

interface FormValues {
  title: string;
  description: string;
  image: string;
}

const Hero = () => {
  const utils = trpc.useContext();
  const { isEditing, startEditing, stopEditing } = useFormEdit();
  const defaultValues = {
    title: "",
    description: "",
    image: "",
  };

  const validationSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
  });

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const { reset, setValue, handleSubmit } = methods;

  const { data } = trpc.manageSection.getHeroSection.useQuery();
  const { mutate, isLoading: isSubmitting } =
    trpc.manageSection.updateHeroSection.useMutation({
      onSuccess() {
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
    <Page title="Hero Section">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Hero Section"
        links={[{ name: "Manage Section" }, { name: "Hero Section" }]}
      />
      {/* Breadcrumb End */}

      <Card>
        <CardHeader
          title="Hero Section"
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
                disabled={!isEditing}
                name="title"
                label="Title"
                placeholder="Helping {millions} to grow better"
              />
              <RHFTextField
                multiline
                minRows={4}
                disabled={!isEditing}
                name="description"
                label="Description"
              />
              <Box>
                <FormLabel label={"Image"} />
                <RHFUploadSingleFile
                  disabled={!isEditing}
                  setValue={setValue}
                  name={"image"}
                />
              </Box>
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
    </Page>
  );
};
export default Hero;
