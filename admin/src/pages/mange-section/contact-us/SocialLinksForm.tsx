import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  LinearProgress,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import Iconify from "../../../components/Iconify";
import useFormEdit from "../../../hooks/useFormEdit";
import IconifyIcons from "../../../IconifyIcons";
import { trpc } from "../../../trpc";

interface FormValues {
  youtube: string;
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  telegram: string;
  discord: string;
}

const SocialLinksForm = () => {
  const utils = trpc.useContext();
  const { data, isLoading } = trpc.manageSection.getSocialLink.useQuery();
  const defaultValues = {
    youtube: "",
    facebook: "",
    instagram: "",
    twitter: "",
    linkedin: "",
    telegram: "",
    discord: "",
  };
  const methods = useForm({
    defaultValues,
  });

  const { reset, handleSubmit } = methods;
  const { isEditing, startEditing, stopEditing } = useFormEdit();
  const { mutate, isLoading: isSubmitting } =
    trpc.manageSection.updateSocialLink.useMutation({
      onSuccess(data, variables) {
        utils.manageSection.getSocialLink.setData(undefined, variables);
        stopEditing();
      },
    });
  const onSubmit = (formData: FormValues) => mutate(formData);

  useEffect(() => {
    reset(data);
  }, [data]);

  const fields = [
    { name: "youtube", label: "Youtube" },
    { name: "facebook", label: "Facebook" },
    { name: "instagram", label: "Instagram" },
    { name: "twitter", label: "Twitter" },
    { name: "linkedin", label: "LinkedIn" },
    { name: "telegram", label: "Telegram" },
    { name: "discord", label: "Discord" },
  ];

  return (
    <Card>
      {isLoading && <LinearProgress />}
      <CardHeader
        title="Social Links"
        action={
          !isEditing ? (
            <IconButton onClick={startEditing}>
              <Iconify icon={IconifyIcons.pencil} />
            </IconButton>
          ) : undefined
        }
      />
      <Divider />
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {fields.map(({ name, label }, index) => (
              <RHFTextField
                InputProps={{
                  startAdornment: (
                    <Iconify
                      sx={{ mr: 1, fontSize: 24 }}
                      icon={
                        IconifyIcons.social[
                          name as keyof typeof IconifyIcons.social
                        ]
                      }
                    />
                  ),
                }}
                key={index}
                disabled={!isEditing}
                name={name}
                type="text"
                label={label}
              />
            ))}

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
};

export default SocialLinksForm;
