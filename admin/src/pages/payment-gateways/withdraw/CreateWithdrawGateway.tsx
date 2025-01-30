import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { capitalCase } from "change-case";
import { useConfirm } from "material-ui-confirm";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import IconifyIcons from "../../../IconifyIcons";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Iconify from "../../../components/Iconify";
import Page from "../../../components/Page";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../components/hook-form";
import RHFHiddenInput from "../../../components/hook-form/RHFHiddenInput";
import ADMIN_PATH, { APP_PATH } from "../../../routes/paths";
import { RouterOutput, trpc } from "../../../trpc";
import CreateLabelDialog, {
  FileExtensions,
  LabelFormValues,
} from "./CreateLabelDialog";

interface FormValues {
  gatewayId?: string;
  logo: string;
  name: string;
  processingTime: string;
  minWithdraw: number;
  maxWithdraw: number;
  charge: number;
  chargeType: "fixed" | "percent";
  status: "active" | "inactive";
  details: {
    label: string;
    required: "required" | "optional";
    inputType: "date" | "input" | "textarea" | "file" | "dropdown";
    fileExtensions: FileExtensions;
    dropdownOptions: {
      option: string;
    }[];
  }[];
}

const CreateWithdrawGateway = () => {
  const utils = trpc.useContext();
  const navigate = useNavigate();
  const params = useParams();
  const confirm = useConfirm();
  const { id: gatewayId } = params;
  const { data, isLoading } = trpc.paymentGateways.withdraw.getDetail.useQuery(
    gatewayId!,
    { enabled: !!gatewayId }
  );

  const defaultValues = {
    gatewayId: undefined,
    logo: "",
    name: "",
    processingTime: "",
    minWithdraw: "" as any as number,
    maxWithdraw: "" as any as number,
    charge: "" as any as number,
    chargeType: "" as "fixed" | "percent",
    status: "" as "active" | "inactive",
    details: [],
  };
  const validationSchema = yup.object().shape({
    logo: yup.string().required("Gateway Image is required"),
    name: yup.string().required("Gateway Name is required"),
    processingTime: yup.string().required("Processing Time is required"),
    minWithdraw: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Minimum Withdraw is required"),
    maxWithdraw: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Maximum Withdraw is required"),
    charge: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Withdraw Charge is required"),
    chargeType: yup.string().required("Withdraw Charge Type is required"),
    status: yup.string().required("Status is required"),
    details: yup.array().min(1, "Minimum 1 detail is  Required"),
  });
  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const { reset, setValue, watch, handleSubmit } = methods;

  // mutate
  const { mutate: create, isLoading: isSubmitting } =
    trpc.paymentGateways.withdraw.create.useMutation({
      onSuccess() {
        utils.paymentGateways.withdraw.list.invalidate();
        utils.paymentGateways.withdraw.getDetail.invalidate(gatewayId);
        navigate(ADMIN_PATH.paymentGateways.withdraw);
      },
    });
  const onSubmit = (formData: FormValues) => create({ ...formData });
  const [open, setOpen] = useState(false);
  const details = watch("details");
  const handleFieldRemove = (index: number) => {
    const fields = details.filter((e, i) => i !== index);
    setValue("details", fields);
  };
  const [editId, setEditId] = useState<number | null>(null);
  const handleFieldUpdate = (index: number) => {
    setOpen(true);
    setEditId(index);
  };
  const handleModalOpen = () => setOpen(true);
  const handleModalClose = () => {
    setEditId(null);
    setOpen(false);
  };

  const onCreateNewField = (newData: LabelFormValues) => {
    if (typeof editId === "number") {
      const data = [...details];
      data[editId] = newData;
      setValue("details", data);
    } else {
      setValue("details", [...details, newData]);
    }
  };

  type ListType = RouterOutput["paymentGateways"]["withdraw"]["list"];

  // Delete withdraw gateway
  const { mutate: remove, isLoading: isDeleting } =
    trpc.paymentGateways.withdraw.delete.useMutation({
      onSuccess() {
        utils.paymentGateways.withdraw.list.setData(
          undefined,
          (lists?: ListType) => lists?.filter((list) => list._id !== gatewayId)
        );
        navigate(ADMIN_PATH.paymentGateways.withdraw);
      },
    });
  const deleteGateway = async () => {
    try {
      await confirm({ description: "Are you sure you want to delete?" });
      remove(gatewayId!);
    } catch (error) {
      console.log("error->", error);
    }
  };

  useEffect(() => {
    if (gatewayId && data) {
      reset(data);
    }
  }, [gatewayId, data]);

  return (
    <Page
      title={gatewayId ? "Update Withdraw Gateway" : "Create Withdraw Gateway"}
    >
      <HeaderBreadcrumbs
        heading={
          gatewayId ? "Update Withdraw Gateway" : "Create Withdraw Gateway"
        }
        links={[
          { name: "Payment Gateways" },
          { name: "Withdraw", href: APP_PATH.paymentGateways.withdraw },
        ]}
      />
      {isLoading && !!gatewayId ? (
        <LinearProgress />
      ) : (
        <Box>
          {open && (
            <CreateLabelDialog
              details={details}
              editId={editId}
              onSuccess={onCreateNewField}
              open={open}
              onClose={handleModalClose}
            />
          )}

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
                        name="minWithdraw"
                        label="Minimum Withdraw"
                      />
                      <RHFTextField
                        maskCurrency
                        name="maxWithdraw"
                        label="Maximum Withdraw"
                      />
                      <RHFTextField
                        maskNumber
                        name="charge"
                        label="Withdraw Charge"
                      />
                      <RHFSelect name="chargeType" label="Withdraw Charge Type">
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
                <Card>
                  <CardHeader
                    title="Payment Requirements"
                    action={
                      <Button
                        onClick={handleModalOpen}
                        startIcon={<Iconify icon="material-symbols:add" />}
                      >
                        Add New
                      </Button>
                    }
                  />
                  <Divider />
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ boxShadow: "none !important" }}>
                            Label
                          </TableCell>
                          <TableCell>Required</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell sx={{ boxShadow: "none !important" }}>
                            Action
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {details.map(
                          ({ label, required, inputType }, index) => (
                            <TableRow key={index}>
                              <TableCell component="th" scope="row">
                                {label}
                              </TableCell>
                              <TableCell>{capitalCase(required)}</TableCell>
                              <TableCell>{capitalCase(inputType)}</TableCell>
                              <TableCell>
                                <IconButton
                                  onClick={() => handleFieldRemove(index)}
                                  color="error"
                                >
                                  <Iconify icon={IconifyIcons.delete} />
                                </IconButton>
                                <IconButton
                                  onClick={() => handleFieldUpdate(index)}
                                  color="success"
                                >
                                  <Iconify icon={IconifyIcons.pencil} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <CardContent>
                    <RHFHiddenInput name="details" />
                  </CardContent>
                </Card>
              </Grid>
              <Grid display={"flex"} item xs={12}>
                {!!gatewayId && (
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

export default CreateWithdrawGateway;
