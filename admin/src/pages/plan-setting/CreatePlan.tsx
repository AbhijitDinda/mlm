import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  LinearProgress,
  Stack,
} from "@mui/material";
import { getQueryKey } from "@trpc/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import Page from "../../components/Page";
import { RESPONSIVE_GAP } from "../../config";
import APP_PATH from "../../routes/paths";
import { trpc } from "../../trpc";

interface FormValues {
  name: string;
  price: number;
  dailyPairCapping: number;
  referralIncome: number;
  pairIncome: number;
  indirectReward: number;
  dailyIndirectRewardCapping: number;
}

const CreatePlan = () => {
  const navigate = useNavigate();
  const { data, isLoading } = trpc.planSetting.getPlan.useQuery();

  const validationSchema = yup.object().shape({
    name: yup.string().required("Plan Name is required"),
    price: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Price is required"),
    dailyPairCapping: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Daily Pair Capping is required"),
    referralIncome: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Referral Income is required"),
    pairIncome: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Pair Income is required"),
    indirectReward: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Indirect Reward is required"),
    dailyIndirectRewardCapping: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Daily Indirect Reward Capping is required"),
  });

  const defaultValues = {
    name: "",
    price: "" as any as number,
    dailyPairCapping: "" as any as number,
    referralIncome: "" as any as number,
    pairIncome: "" as any as number,
    indirectReward: "" as any as number,
    dailyIndirectRewardCapping: "" as any as number,
  };

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, reset } = methods;

  useEffect(() => {
    data && reset(data);
  }, [data]);

  const utils = trpc.useContext();

  // mutate
  const { mutate, isLoading: isSubmitting } =
    trpc.planSetting.create.useMutation({
      onSuccess({ data }) {
        utils.planSetting.getPlan.setData(undefined, data);
        navigate(APP_PATH.planSetting.root);
      },
    });

  const onSubmit = async (formData: FormValues) => mutate(formData);

  return (
    <Page title="Plan Setting">
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs
        heading="Plan Setting"
        links={[
          { name: "Settings" },
          { name: "Plan Setting", href: APP_PATH.planSetting.root },
          { name: "Create Plan" },
        ]}
      />
      {/* Breadcrumb End */}

      {isLoading ? (
        <LinearProgress />
      ) : (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={RESPONSIVE_GAP}>
            <Card>
              <CardHeader title="Plan 1" />
              <Divider />
              <CardContent>
                <Stack spacing={3}>
                  <RHFTextField name="name" label="Plan Name" />
                  <RHFTextField maskCurrency name="price" label="Price" />
                  <RHFTextField
                    maskCurrency
                    name="referralIncome"
                    label="Referral Income"
                  />
                  <RHFTextField
                    maskCurrency
                    name="pairIncome"
                    label="Pair Income"
                  />
                  <RHFTextField
                    maskNumber
                    name="dailyPairCapping"
                    label="Daily Pair Capping"
                  />
                  <RHFTextField
                    maskCurrency
                    name="indirectReward"
                    label="Indirect Reward"
                  />
                  <RHFTextField
                    maskNumber
                    name="dailyIndirectRewardCapping"
                    label="Daily Indirect Reward Capping"
                  />
                </Stack>
              </CardContent>
            </Card>
            <LoadingButton
              fullWidth
              type="submit"
              loading={isSubmitting}
              variant="contained"
              color="primary"
              size="large"
            >
              Submit
            </LoadingButton>
          </Stack>
        </FormProvider>
      )}
    </Page>
  );
};

export default CreatePlan;
