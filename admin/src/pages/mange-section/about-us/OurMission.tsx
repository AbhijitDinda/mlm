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
  LinearProgress,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import IconifyIcons from "../../../IconifyIcons";
import FormLabel from "../../../components/FormLabel";
import Iconify from "../../../components/Iconify";
import {
  FormProvider,
  RHFTextField,
  RHFUploadSingleFile,
} from "../../../components/hook-form";
import useFormEdit from "../../../hooks/useFormEdit";
import { trpc } from "../../../trpc";

interface FormValues {
  title: string;
  description: string;
  image: string;
}

const OurMission = () => {
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
    image: yup.string().required("Image is required"),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { reset, setValue, handleSubmit } = methods;

  const { data, isLoading } = trpc.manageSection.getOurMission.useQuery();
  const { mutate, isLoading: isSubmitting } =
    trpc.manageSection.updateOurMission.useMutation({
      onSuccess(data, variables) {
        utils.manageSection.getOurMission.setData(undefined, variables);
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
        title="Our Mission"
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
            <RHFTextField disabled={!isEditing} name="title" label="Title" />
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
  );
};
export default OurMission;
