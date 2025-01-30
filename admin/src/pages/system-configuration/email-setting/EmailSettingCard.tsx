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
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "../../../components/hook-form";
import Iconify from "../../../components/Iconify";
import PasswordTextField from "../../../components/PasswordTextField";
import useFormEdit from "../../../hooks/useFormEdit";
import { trpc } from "../../../trpc";

// ----------------------------------------------------------------------

interface FormValues {
  encryption: "ssl" | "tls";
  host: string;
  port: number;
  userName: string;
  password: string;
}

export default function EmailSettingCard() {
  const utils = trpc.useContext();
  const { isEditing, startEditing, stopEditing } = useFormEdit();
  const ChangePassWordSchema = yup.object().shape({
    encryption: yup.string().required("Encryption is required"),
    host: yup.string().required("Host is required"),
    port: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Port is required"),
    userName: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  const defaultValues = {
    encryption: "" as "ssl" | "tls",
    host: "",
    port: "" as any as number,
    userName: "",
    password: "",
  };
  const methods = useForm<FormValues>({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
    mode: "all",
  });
  const { reset, handleSubmit } = methods;

  const { data, isLoading } =
    trpc.systemConfiguration.getEmailSetting.useQuery();

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  // mutate
  const { mutate, isLoading: isSubmitting } =
    trpc.systemConfiguration.updateEmailSetting.useMutation({
      onSuccess(data, variables) {
        utils.systemConfiguration.getEmailSetting.setData(undefined, variables);
        stopEditing();
      },
    });
  const onSubmit = (formData: FormValues) => mutate(formData);

  return isLoading ? (
    <LinearProgress />
  ) : (
    <Card>
      <CardHeader
        title="Email Setting"
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
            <RHFSelect
              disabled={!isEditing}
              name="encryption"
              type="text"
              label="Encryption"
            >
              <MenuItem value="ssl">SSL</MenuItem>
              <MenuItem value="tls">TLS</MenuItem>
            </RHFSelect>
            <RHFTextField
              disabled={!isEditing}
              name="host"
              type="text"
              label="Host"
            />
            <RHFTextField
              disabled={!isEditing}
              name="port"
              type="text"
              label="Port"
            />
            <RHFTextField
              disabled={!isEditing}
              name="userName"
              type="text"
              label="Username"
            />
            <PasswordTextField
              disabled={!isEditing}
              name="password"
              label="Password"
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
}
