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
  MenuItem,
  Stack,
} from "@mui/material";
import { UseFormSetValue, useForm } from "react-hook-form";
import * as Yup from "yup";

import IconifyIcons from "../../IconifyIcons";
import FormLabel from "../../components/FormLabel";
import Iconify from "../../components/Iconify";
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadSingleFile,
} from "../../components/hook-form";
import RHFDatePicker from "../../components/hook-form/RHFDatePicker";
import { User } from "../../contexts/JWTContext";
import useAuth from "../../hooks/useAuth";
import useFormEdit from "../../hooks/useFormEdit";
import { toExt } from "../../hooks/useUploadFile";
import { trpc } from "../../trpc";

// ----------------------------------------------------------------------

interface FormValues {
  firstName: string;
  lastName: string;
  kyc: { [x: string]: string };
}

export default function MyProfile() {
  const { user, updateUser } = useAuth();
  if (!user) return null;

  const { isEditing, startEditing, stopEditing } = useFormEdit();
  const {
    kyc,
    kycData: { user: userKycData, form: kycFormData },
  } = user;

  const profileSchema = Yup.object().shape({
    firstName: Yup.string()
      .required("First Name is required")
      .max(15, "Maximum 15 characters are allowed"),
    lastName: Yup.string()
      .required("Last Name is required")
      .max(15, "Maximum 15 characters are allowed"),
    kyc: Yup.object().shape({
      ...kycFormData.reduce((acc, { _id, label, required, inputType }) => {
        let v = Yup.string();
        if (required === "required") {
          v = v.required(`${label} is required`);
        }
        if (inputType === "textarea") {
          v = v.max(1000, "Maximum 1000 characters are allowed");
        }
        if (inputType === "input") {
          v = v.max(30, "Maximum 30 characters are allowed");
        }
        return { ...acc, [_id]: v };
      }, {}),
    }),
  });

  const defaultValues = {
    firstName: user.firstName,
    lastName: user.lastName,
    kyc: {
      ...kycFormData.reduce((acc, { _id }) => {
        return {
          ...acc,
          [_id]: userKycData[_id as keyof typeof userKycData] ?? "",
        };
      }, {}),
    },
  };

  const methods = useForm({
    resolver: yupResolver(profileSchema),
    defaultValues,
  });

  const { setValue, handleSubmit } = methods;

  const { mutate, isLoading: isSubmitting } =
    trpc.profile.updateUser.useMutation({
      onSuccess({ data }) {
        updateUser(data);
        stopEditing();
      },
    });

  const onSubmit = (data: FormValues) => mutate(data);

  return (
    <Card>
      <Box sx={{ bgcolor: "background.neutral" }}>
        <CardHeader
          title="My Profile"
          action={
            !isEditing ? (
              <IconButton onClick={startEditing}>
                <Iconify icon={IconifyIcons.pencil} />
              </IconButton>
            ) : undefined
          }
        />
        <Divider />
      </Box>
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <RHFTextField
                disabled={!isEditing}
                name="firstName"
                type="text"
                label="First Name"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <RHFTextField
                disabled={!isEditing}
                name="lastName"
                type="text"
                label="Last Name"
              />
            </Grid>

            {kycFormData.map((data) => {
              return (
                <Grid item xs={12} md={6} key={data._id}>
                  <Input
                    disabled={
                      !isEditing ||
                      (kyc === "approved" && data.required === "required")
                    }
                    setValue={setValue}
                    name={data._id}
                    {...data}
                  />
                </Grid>
              );
            })}

            <Grid item xs={12} marginLeft="auto">
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
            </Grid>
          </Grid>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

function Input({
  setValue,
  label,
  inputType,
  fileExtensions,
  dropdownOptions,
  name,
  disabled,
}: User["kycData"]["form"][number] & {
  setValue: UseFormSetValue<any>;
  name: string;
  disabled: boolean;
}) {
  name = `kyc.${name}`;
  switch (inputType) {
    case "input":
      return <RHFTextField disabled={disabled} name={name} label={label} />;
    case "textarea":
      return (
        <RHFTextField
          disabled={disabled}
          multiline
          minRows={4}
          name={name}
          label={label}
        />
      );
    case "date": {
      return <RHFDatePicker disabled={disabled} name={name} label={label} />;
    }
    case "dropdown": {
      return (
        <RHFSelect disabled={disabled} name={name} label={label}>
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
            disabled={disabled}
            setValue={setValue}
            name={name}
          />
        </Box>
      );
    }
  }
}
