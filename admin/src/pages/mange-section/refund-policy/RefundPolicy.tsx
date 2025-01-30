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
  Stack
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Editor from "../../../components/Editor";
import FormLabel from "../../../components/FormLabel";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import Iconify from "../../../components/Iconify";
import Page from "../../../components/Page";
import useFormEdit from "../../../hooks/useFormEdit";
import { trpc } from "../../../trpc";
import { isObjEmpty } from "../../../utils/fns";

interface FormValues {
  title: string;
  description: string;
}

const RefundPolicy = () => {
  const utils = trpc.useContext();
  const { isEditing, startEditing, stopEditing } = useFormEdit();
  const defaultValues = {
    title: "",
    description: "",
  };

  const FormSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(FormSchema),
    mode: "all",
  });

  const { getValues, reset, setValue, handleSubmit } = methods;
  const { data, isLoading } = trpc.manageSection.getRefundPolicy.useQuery();
  useEffect(() => {
    !isObjEmpty(data) && reset(data);
  }, [data]);
  const onChangeValue = (value: string) => {
    setValue("description", value);
  };

  const { mutate, isLoading: isSubmitting } =
    trpc.manageSection.updateRefundPolicy.useMutation({
      onSuccess(data, variables) {
        utils.manageSection.getRefundPolicy.setData(undefined, variables);
        stopEditing();
      },
    });
  const onSubmit = (formData: FormValues) => mutate(formData);

  return (
    <Page title="Refund Policy">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Refund Policy"
        links={[{ name: "Manage Section" }, { name: "Refund Policy" }]}
      />
      {/* Breadcrumb End */}
      {isLoading ? (
        <LinearProgress />
      ) : (
        <Card>
          <CardHeader
            title="Refund Policy"
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
                <Box>
                  <FormLabel label="Description" />
                  <Editor
                    disabled={!isEditing}
                    onChangeValue={onChangeValue}
                    initialValue={getValues().description}
                  />
                  <RHFTextField
                    sx={{ "& fieldset": { display: "none" } }}
                    type="hidden"
                    name="description"
                  />{" "}
                </Box>
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
                      Update
                    </LoadingButton>
                  </Stack>
                )}
              </Stack>
            </FormProvider>
          </CardContent>
        </Card>
      )}
    </Page>
  );
};

export default RefundPolicy;
