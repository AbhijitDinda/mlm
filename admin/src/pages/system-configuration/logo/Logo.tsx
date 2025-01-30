import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import Page from "../../../components/Page";
import {
  FormProvider,
  RHFUploadAvatar,
  RHFUploadSingleFile,
} from "../../../components/hook-form";
import { RESPONSIVE_GAP } from "../../../config";
import useConfiguration from "../../../hooks/useConfiguration";
import { trpc } from "../../../trpc";

const Logo = () => {
  return (
    <Page title="Logo & Favicon">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Logo & Favicon"
        links={[{ name: "System Configuration" }, { name: "Logo & Favicon" }]}
      />
      {/* Breadcrumb End */}

      <Grid container spacing={RESPONSIVE_GAP}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader title="Logo" sx={{ bgcolor: "background.neutral" }} />
            <CardContent>
              <LogoUpload />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title="Full Logo"
              sx={{ bgcolor: "background.neutral" }}
            />
            <CardContent>
              <FullLogoUpload />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title="Favicon"
              sx={{ bgcolor: "background.neutral" }}
            />
            <CardContent>
              <FaviconUpload />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Page>
  );
};

function LogoUpload() {
  const { logo } = useConfiguration();
  const utils = trpc.useContext();
  const { mutate } = trpc.systemConfiguration.logo.useMutation({
    onSuccess() {
      utils.setting.configuration.refetch();
    },
  });

  const defaultValues = {
    logo,
  };
  const methods = useForm({
    defaultValues,
  });
  const { setValue } = methods;

  useEffect(() => {
    setValue("logo", logo);
  }, [logo]);

  const onSuccess = (file: string) => mutate(file);

  return (
    <FormProvider methods={methods} onSubmit={() => {}}>
      <RHFUploadAvatar onSuccess={onSuccess} name="logo" setValue={setValue} />
    </FormProvider>
  );
}
function FullLogoUpload() {
  const { fullLogo } = useConfiguration();
  const utils = trpc.useContext();
  const { mutate } = trpc.systemConfiguration.fullLogo.useMutation({
    onSuccess() {
      utils.setting.configuration.refetch();
    },
  });

  const defaultValues = {
    fullLogo,
  };
  const methods = useForm({
    defaultValues,
  });
  const { setValue } = methods;

  useEffect(() => {
    setValue("fullLogo", fullLogo);
  }, [fullLogo]);

  const onSuccess = (file: string) => mutate(file);

  return (
    <FormProvider methods={methods} onSubmit={() => {}}>
      <RHFUploadSingleFile
        onSuccess={onSuccess}
        name="fullLogo"
        setValue={setValue}
      />
    </FormProvider>
  );
}

function FaviconUpload() {
  const { favicon } = useConfiguration();
  const utils = trpc.useContext();
  const { mutate } = trpc.systemConfiguration.favicon.useMutation({
    onSuccess() {
      utils.setting.configuration.refetch();
    },
  });

  const defaultValues = {
    favicon,
  };
  const methods = useForm({
    defaultValues,
  });
  const { setValue } = methods;

  useEffect(() => {
    setValue("favicon", favicon);
  }, [favicon]);

  const onSuccess = (file: string) => mutate(file);

  return (
    <FormProvider methods={methods} onSubmit={() => {}}>
      <RHFUploadAvatar
        onSuccess={onSuccess}
        name="favicon"
        setValue={setValue}
      />
    </FormProvider>
  );
}

export default Logo;
