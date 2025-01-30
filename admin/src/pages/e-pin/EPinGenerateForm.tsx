import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, CardActions, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import { trpc } from "../../trpc";

interface FormValues {
  userId: number;
  ePins: number;
}

export const EPinGenerateForm = ({
  onSuccess,
  transferUser,
}: {
  onSuccess: () => void;
  transferUser?: { userId: number; content: React.ReactNode };
}) => {
  const utils = trpc.useContext();
  const defaultValues = {
    userId: transferUser ? transferUser.userId : 0,
    ePins: "" as any as number,
  };
  const validationSchema = yup.object().shape({
    ePins: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .max(100, "Maximum 100 E-Pins can be created at a time")
      .required("E-Pins is required"),
  });
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });
  const { reset, handleSubmit } = methods;

  // mutate
  const { mutate, isLoading: isSubmitting } = trpc.ePin.create.useMutation({
    onSuccess() {
      utils.ePin.ePinList.invalidate();
      utils.ePin.transferList.invalidate();
      utils.ePin.summary.invalidate();
      reset();
      onSuccess && onSuccess();
    },
  });
  const onSubmit = (formData: FormValues) => {
    mutate(formData);
  };

  return (
    <Box sx={{ py: 2 }}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {transferUser && transferUser.content}
          <RHFTextField maskNumber name="ePins" label="E-Pins" />
          <CardActions>
            <LoadingButton
              loading={isSubmitting}
              type="submit"
              size="large"
              variant="contained"
              fullWidth
            >
              Generate E-Pins
            </LoadingButton>
          </CardActions>
        </Stack>
      </FormProvider>
    </Box>
  );
};
export default EPinGenerateForm;
