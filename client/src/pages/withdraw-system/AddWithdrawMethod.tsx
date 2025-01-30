import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress,
  MenuItem,
  Stack,
} from "@mui/material";
import { UseFormSetValue, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import FormLabel from "../../components/FormLabel";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import { RHFUploadSingleFile } from "../../components/hook-form";
import FormProvider from "../../components/hook-form/FormProvider";
import RHFDatePicker from "../../components/hook-form/RHFDatePicker";
import RHFSelect from "../../components/hook-form/RHFSelect";
import RHFTextField from "../../components/hook-form/RHFTextField";
import { FileExtensions, toExt } from "../../hooks/useUploadFile";
import { APP_PATH } from "../../routes/paths";
import { trpc } from "../../trpc";
import { isObjEmpty } from "../../utils/fns";

export interface LabelFormValues {
  name: string;
  label: string;
  required: "required" | "optional";
  inputType: "date" | "input" | "textarea" | "file" | "dropdown";
  fileExtensions: FileExtensions;
  dropdownOptions: {
    option: string;
  }[];
}
interface FormValues {
  [x: string]: string;
}

const Input = ({
  setValue,
  label,
  inputType,
  fileExtensions,
  dropdownOptions,
  name,
}: LabelFormValues & { setValue: UseFormSetValue<any> }) => {
  switch (inputType) {
    case "input":
      return <RHFTextField name={name} label={label} />;
    case "textarea":
      return <RHFTextField multiline minRows={4} name={name} label={label} />;
    case "date": {
      return <RHFDatePicker name={name} label={label} />;
    }
    case "dropdown": {
      return (
        <RHFSelect name={name} label={label}>
          {dropdownOptions.map(({ option }) => {
            return (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            );
          })}
        </RHFSelect>
      );
    }
    case "file": {
      return (
        <Box>
          <FormLabel label={label} />
          <RHFUploadSingleFile
            accept={toExt(fileExtensions)}
            setValue={setValue}
            name={name}
          />
        </Box>
      );
    }
  }
};

const Form = ({
  _id,
  details,
  name,
  isUpdated,
  userData,
}: {
  _id: string;
  details: LabelFormValues[];
  name: string;
  isUpdated: boolean;
  userData: { [x: string]: string };
}) => {
  const utils = trpc.useContext();
  const navigate = useNavigate();
  const validationSchema = details.reduce(
    (a, { name, label }) => ({
      ...a,
      [name]: yup.string().required(`${label} is required`),
    }),
    {}
  );

  const values = details
    .map(({ name }) => name)
    .reduce((a, v) => {
      return { ...a, [v]: "" };
    }, {});

  const defaultValues = isObjEmpty(userData)
    ? values
    : {
        ...values,
        ...userData,
      };

  const yupSchema = yup.object().shape(validationSchema);
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(yupSchema),
  });

  const { setValue, handleSubmit } = methods;

  // mutate
  const { mutate, isLoading: isSubmitting } =
    trpc.withdraw.createUserGateway.useMutation({
      onSuccess() {
        utils.withdraw.getUserGatewayList.invalidate();
        utils.withdraw.getGatewayData.invalidate(_id);
        navigate(APP_PATH.withdrawSystem.methods);
      },
    });

  const onSubmit = (formData: FormValues) => {
    mutate({ _id, details: formData });
  };

  return (
    <Stack spacing={3}>
      {isUpdated && (
        <Alert severity="warning">
          You need to updated details to withdraw
        </Alert>
      )}
      <Box>
        <Card sx={{ maxWidth: 600, m: "auto" }}>
          <CardHeader title={name} />
          <Divider />
          <CardContent>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                {details.map((a) => {
                  return <Input setValue={setValue} key={a.name} {...a} />;
                })}
                <Box sx={{ textAlign: "right" }}>
                  <LoadingButton
                    type="submit"
                    size="large"
                    variant="contained"
                    loading={isSubmitting}
                  >
                    Submit
                  </LoadingButton>
                </Box>
              </Stack>
            </FormProvider>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
};

const AddWithdrawMethod = () => {
  const params = useParams();
  const { id: gatewayId } = params;
  if (!gatewayId) return null;

  const { data, isLoading } = trpc.withdraw.getGatewayData.useQuery(gatewayId);
  const result = data! ?? { details: [], name: "" };
  const { gateway, userData, isUpdated, wallet } = result;
  const { details, name } = gateway ?? {};

  return (
    <Page title="Add Withdraw Method">
      <HeaderBreadcrumbs
        heading="Add Withdraw Method"
        links={[
          { name: "Dashboard", href: APP_PATH.dashboard },
          { name: "Withdraw", href: APP_PATH.withdrawSystem.methods },
          { name: "Add Withdraw Details" },
        ]}
      />
      {isLoading ? (
        <LinearProgress />
      ) : (
        <Form
          _id={gatewayId}
          details={details}
          name={name}
          isUpdated={isUpdated}
          userData={userData}
        />
      )}
    </Page>
  );
};

export default AddWithdrawMethod;
