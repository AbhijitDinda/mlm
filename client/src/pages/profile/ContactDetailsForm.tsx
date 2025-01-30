import { yupResolver } from "@hookform/resolvers/yup";
import { Grid, LinearProgress } from "@mui/material";
import { matchIsValidTel } from "mui-tel-input";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";

import { FormProvider, RHFTextField } from "../../components/hook-form";
import RHFTelInput from "../../components/hook-form/RHFTelInput";
import { trpc } from "../../trpc";

const isValidPhoneNumber = (value: string) => {
  const isValid = matchIsValidTel(value);
  return isValid;
};

interface FormValues {
  address: string;
  country: string;
  state: string;
  city: string;
  pinCode: number;
  mobileNumber: string;
}

const ContactDetailsForm = ({
  disabled = false,
  action,
  onSuccess,
}: {
  disabled: boolean;
  action: (data: boolean) => JSX.Element;
  onSuccess: () => void;
}) => {
  const utils = trpc.useContext();
  const defaultValues = {
    address: "",
    country: "",
    state: "",
    city: "",
    pinCode: "" as any as number,
    mobileNumber: "",
  };
  const validationSchema = Yup.object().shape({
    address: Yup.string().required("Address is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    pinCode: Yup.number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Pin Code is required"),
    mobileNumber: Yup.string()
      .required("Mobile Number is required")
      .test("Phone", "Mobile Number is not valid", isValidPhoneNumber),
  });
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const { mutate, isLoading: isSubmitting } =
    trpc.profile.updateContactDetails.useMutation({
      onSuccess(data, variables) {
        utils.profile.getContactDetails.setData(undefined, variables);
        if (onSuccess) onSuccess();
      },
    });
  const onSubmit = (formData: FormValues) => mutate(formData);
  const { data, isLoading } = trpc.profile.getContactDetails.useQuery();

  useEffect(() => {
    data && reset(data);
  }, [data]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {isLoading && <LinearProgress />}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled={disabled}
            name="address"
            type="text"
            label="Address"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled={disabled}
            name="country"
            type="text"
            label="Country"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled={disabled}
            name="state"
            type="text"
            label="State/Region"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled={disabled}
            name="city"
            type="text"
            label="City"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTextField
            disabled={disabled}
            name="pinCode"
            type="text"
            label="Pin Code/Zip Code"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <RHFTelInput
            disabled={disabled}
            sx={{ width: 1 }}
            name="mobileNumber"
            label="Mobile Number"
          />
        </Grid>

        {action && (
          <Grid item marginLeft="auto">
            {action(isSubmitting)}
          </Grid>
        )}
      </Grid>
    </FormProvider>
  );
};

export default ContactDetailsForm;
