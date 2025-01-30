import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  LinearProgress,
  MenuItem,
  Stack,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Iconify from "../../../components/Iconify";
import Page from "../../../components/Page";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../components/hook-form";
import APP_PATH from "../../../routes/paths";
import { trpc } from "../../../trpc";
import ManualDepositDetailFields from "./ManualDepositDetailFields";
import RHFHiddenInput from "../../../components/hook-form/RHFHiddenInput";

interface FormValues {
  gatewayId?: string;
  logo: string;
  name: string;
  processingTime: string;
  charge: number;
  chargeType: "fixed" | "percent";
  status: "active" | "inactive";
  details: {
    value: string;
    type: "input" | "image";
    label: string;
  }[];
  minDeposit: number;
  maxDeposit: number;
}

const CreateManualDeposit = () => {
  const confirm = useConfirm();
  const params = useParams();
  const navigate = useNavigate();
  const utils = trpc.useContext();
  const { id: _id } = params;

  const { data, isLoading } =
    trpc.paymentGateways.manualDeposit.getDetail.useQuery(_id!, {
      enabled: !!_id,
    });
  const isEditing = !!_id;

  const defaultValues = {
    gatewayId: _id,
    logo: "",
    name: "",
    processingTime: "",
    minDeposit: "" as any as number,
    maxDeposit: "" as any as number,
    charge: "" as any as number,
    chargeType: "" as "fixed" | "percent",
    status: "" as "active" | "inactive",
    details: [],
  };
  const validationSchema = yup.object().shape({
    logo: yup.string().required("Gateway Image is required"),
    name: yup.string().required("Gateway Name is required"),
    processingTime: yup.string().required("Processing Time is required"),
    minDeposit: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Minimum Deposit is required"),
    maxDeposit: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Maximum Deposit is required"),
    charge: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Deposit Charge is required"),
    chargeType: yup.string().required("Deposit Charge Type is required"),
    status: yup.string().required("Status is required"),
    details: yup
      .array()
      .of(
        yup.object().shape({
          label: yup.string().required("Label is required"),
          value: yup.string().required("Value is required"),
        })
      )
      .min(1, "Minimum 1 Details is required"),
  });
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const { reset, setValue, handleSubmit } = methods;

  // create
  const { mutate, isLoading: isSubmitting } =
    trpc.paymentGateways.manualDeposit.create.useMutation({
      onSuccess({ data }) {
        // for all lists
        utils.paymentGateways.manualDeposit.list.invalidate();

        //for this
        utils.paymentGateways.manualDeposit.getDetail.setData(_id!, data);
        navigate(APP_PATH.paymentGateways.manualDeposit);
      },
    });
  const onSubmit = async (formData: FormValues) => mutate(formData);

  // delete
  const { mutate: remove, isLoading: isDeleting } =
    trpc.paymentGateways.manualDeposit.delete.useMutation({
      onSuccess() {
        // for all lists
        utils.paymentGateways.manualDeposit.list.setData(undefined, (lists) =>
          lists?.filter((list) => list._id !== _id)
        );

        navigate(APP_PATH.paymentGateways.manualDeposit);
      },
    });

  const deleteGateway = async () => {
    try {
      await confirm({
        description: "Are you sure you want to delete this gateway?",
      });
      remove(_id!);
    } catch (error) {
      console.log("deleteGateway ~ error:", error);
    }
  };

  useEffect(() => {
    if (data) reset(data);
  }, [data]);

  return (
    <Page title={isEditing ? "Update Manual Deposit" : "Create Manual Deposit"}>
      <HeaderBreadcrumbs
        heading={isEditing ? "Update Manual Deposit" : "Create Manual Deposit"}
        links={[
          { name: "Payment Gateways" },
          {
            name: "Manual Deposit",
            href: APP_PATH.paymentGateways.manualDeposit,
          },
        ]}
      />
      {isEditing && isLoading ? (
        <LinearProgress />
      ) : (
        <Box>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Card>
                  <CardHeader title="Details" />
                  <Divider />
                  <CardContent>
                    <Stack spacing={4}>
                      <RHFUploadAvatar setValue={setValue} name="logo" />
                      <RHFTextField name="name" label="Gateway Name" />
                      <RHFTextField
                        name="processingTime"
                        label="Processing Time"
                      />
                      <RHFTextField
                        maskCurrency
                        name="minDeposit"
                        label="Minimum Deposit"
                      />
                      <RHFTextField
                        maskCurrency
                        name="maxDeposit"
                        label="Maximum Deposit"
                      />
                      <RHFTextField
                        maskNumber
                        name="charge"
                        label="Deposit Charge"
                      />
                      <RHFSelect name="chargeType" label="Deposit Charge Type">
                        <MenuItem value="fixed">Fixed</MenuItem>
                        <MenuItem value="percent">Percent</MenuItem>
                      </RHFSelect>
                      <RHFSelect name="status" label="Status">
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="inactive">Inactive</MenuItem>
                      </RHFSelect>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <ManualDepositDetailFields setValue={setValue} />
                  <RHFHiddenInput name="details" />
                </Stack>
              </Grid>
              <Grid display={"flex"} item xs={12}>
                {!!_id && (
                  <LoadingButton
                    loading={isDeleting}
                    onClick={deleteGateway}
                    startIcon={<Iconify icon="mdi:trash" />}
                    color="error"
                    variant="contained"
                  >
                    Delete
                  </LoadingButton>
                )}
                <LoadingButton
                  type="submit"
                  sx={{ ml: "auto" }}
                  variant="contained"
                  size="large"
                  loading={isSubmitting}
                >
                  Submit
                </LoadingButton>
              </Grid>
            </Grid>
          </FormProvider>
        </Box>
      )}
    </Page>
  );
};

export default CreateManualDeposit;
