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
import * as Yup from "yup";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
} from "../../../components/hook-form";
import Iconify from "../../../components/Iconify";
import useFormEdit from "../../../hooks/useFormEdit";
import IconifyIcons from "../../../IconifyIcons";
import { trpc } from "../../../trpc";
import CountrySelect from "./CountrySelect";
import TimezoneSelect from "./TimezoneSelect";

interface FormValues {
  appName: string;
  timezone: string;
  currency: string;
  currencyPosition: "prefix" | "suffix";
  balanceTransferCharge: number;
  balanceTransferChargeType: "fixed" | "percent";
  emailAccountLimit: number;
  country: string;
}

const Site = () => {
  const utils = trpc.useContext();
  const { isEditing, startEditing, stopEditing } = useFormEdit();

  const SiteSettingFormSchema = Yup.object().shape({
    appName: Yup.string().required("Site Title is required"),
    currency: Yup.string().required("Currency is required"),
    currencyPosition: Yup.string().required("Currency Position is required"),
    timezone: Yup.string().required("Timezone is required"),
    balanceTransferCharge: Yup.number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Balance Transfer Charge is required"),
    balanceTransferChargeType: Yup.string().required(
      "Balance Transfer Charge Type is required"
    ),
    emailAccountLimit: Yup.number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Account Limit Per Email is required"),
  });

  const defaultValues = {
    appName: "",
    currency: "",
    country: "",
    timezone: "",
    currencyPosition: "" as "prefix" | "suffix",
    balanceTransferCharge: "" as any as number,
    balanceTransferChargeType: "" as "fixed" | "percent",
    emailAccountLimit: "" as any as number,
  };

  const methods = useForm<FormValues>({
    resolver: yupResolver(SiteSettingFormSchema),
    defaultValues,
  });

  const { reset, handleSubmit, setValue, watch } = methods;
  const country = watch("country");

  // get
  const { data, isLoading } =
    trpc.systemConfiguration.getSiteSetting.useQuery();
  useEffect(() => {
    if (data) reset(data);
  }, [data]);

  // mutate
  const { mutate, isLoading: isSubmitting } =
    trpc.systemConfiguration.updateSiteSetting.useMutation({
      onSuccess(data, variables) {
        utils.systemConfiguration.getSiteSetting.setData(undefined, variables);
        stopEditing();
      },
    });
  const onSubmit = (formData: FormValues) => mutate(formData);

  return (
    <Card>
      {isLoading && <LinearProgress />}
      <CardHeader
        title="Site Settings"
        action={
          <>
            {!isEditing && (
              <IconButton onClick={startEditing}>
                <Iconify icon={IconifyIcons.pencil} />
              </IconButton>
            )}
          </>
        }
        sx={{ pb: 2 }}
      />
      <Divider />
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <RHFTextField
              disabled={!isEditing}
              name="appName"
              type="text"
              label="App Name"
            />
            <RHFTextField
              disabled={!isEditing}
              name="currency"
              type="text"
              label="Currency"
            />
            <RHFSelect
              disabled={!isEditing}
              name="currencyPosition"
              type="text"
              label="Currency Position"
            >
              <MenuItem value="prefix">Prefix</MenuItem>
              <MenuItem value="suffix">Suffix</MenuItem>
            </RHFSelect>
            <RHFTextField
              select
              disabled={!isEditing}
              name="balanceTransferChargeType"
              type="text"
              label="Balance Transfer Charge Type"
            >
              <MenuItem value="fixed">Fixed</MenuItem>
              <MenuItem value="percent">Percent</MenuItem>
            </RHFTextField>
            <RHFTextField
              disabled={!isEditing}
              name="balanceTransferCharge"
              type="text"
              label="Balance Transfer Charge"
            />
            <RHFTextField
              maskNumber
              disabled={!isEditing}
              name="emailAccountLimit"
              type="text"
              label="Account Limited Per Email"
            />
            <TimezoneSelect
              disabled={!isEditing}
              name="timezone"
              label="Timezone"
            />
            <CountrySelect
              disabled={!isEditing}
              country={country}
              setValue={setValue}
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

export default Site;
