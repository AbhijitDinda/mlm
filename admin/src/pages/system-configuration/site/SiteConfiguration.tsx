import { LoadingButton } from "@mui/lab";
import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormProvider, RHFCheckbox } from "../../../components/hook-form";
import { trpc } from "../../../trpc";
import { Link as RouterLink } from "react-router-dom";
import APP_PATH from "../../../routes/paths";

interface FormValues {
  registration: boolean;
  contactDetails: boolean;
  kycVerification: boolean;
}

const SiteConfiguration = () => {
  const utils = trpc.useContext();

  const { data, isLoading } =
    trpc.systemConfiguration.getSiteConfiguration.useQuery();
  const defaultValues = {
    registration: false,
    contactDetails: false,
    kycVerification: false,
  };
  const methods = useForm<FormValues>({
    defaultValues,
  });
  const { reset, handleSubmit } = methods;

  // update
  const { mutate, isLoading: isSubmitting } =
    trpc.systemConfiguration.updateSiteConfiguration.useMutation({
      onSuccess(data, variables) {
        utils.systemConfiguration.getSiteConfiguration.setData(
          undefined,
          variables
        );
        utils.setting.configuration.setData(undefined, (data) => {
          return data ? { ...data, siteConfiguration: variables } : undefined;
        });
      },
    });

  const onSubmit = (formData: FormValues) => mutate(formData);
  useEffect(() => {
    data && reset(data);
  }, [data]);

  return (
    <Card>
      {isLoading && <LinearProgress />}
      <CardHeader
        title="Site Configuration"
        subheader="You can enable and disable the features as per your requirements"
        sx={{ pb: 2 }}
      />
      <Divider />
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} alignItems="flex-end">
            <Stack sx={{ width: 1 }}>
              <CardActionArea>
                <RHFCheckbox
                  label={
                    <Stack sx={{ ml: 1 }}>
                      <Typography variant="overline">
                        User Registration
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        If you uncheck this option, registration will be stopped
                        .
                      </Typography>
                    </Stack>
                  }
                  name="registration"
                  sx={{ m: 0, width: 1, py: 2 }}
                />
              </CardActionArea>
              <Divider />

              <CardActionArea>
                <RHFCheckbox
                  label={
                    <Stack sx={{ ml: 1 }}>
                      <Typography variant="overline">
                        Contact Details
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        If you check this option, users must have to submit
                        their contact details to approve kyc.
                      </Typography>
                    </Stack>
                  }
                  name="contactDetails"
                  sx={{ m: 0, width: 1, py: 2 }}
                />
              </CardActionArea>
              <Divider />

              <CardActionArea>
                <RHFCheckbox
                  label={
                    <Stack sx={{ ml: 1 }}>
                      <Typography variant="overline">
                        Kyc Verification
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        If you check this option Kyc (Know Your Client) , users
                        must have to submit the required information of{" "}
                        <Link
                          component={RouterLink}
                          to={APP_PATH.systemConfiguration.kyc}
                        >
                          kyc setting
                        </Link>{" "}
                        page to withdraw payment.
                      </Typography>
                    </Stack>
                  }
                  name="kycVerification"
                  sx={{ m: 0, width: 1, py: 2 }}
                />
              </CardActionArea>
            </Stack>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Save Changes
            </LoadingButton>
          </Stack>
        </FormProvider>
      </CardContent>
    </Card>
  );
};

export default SiteConfiguration;
