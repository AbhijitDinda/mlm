import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  LinearProgress,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import Iconify from "../../components/Iconify";
import Page from "../../components/Page";
import { RESPONSIVE_GAP } from "../../config";
import useFormEdit from "../../hooks/useFormEdit";
import useFormRepeater from "../../hooks/useFormRepeater";
import IconifyIcons from "../../IconifyIcons";
import { trpc } from "../../trpc";

interface FormValues {
  reactivation: [
    {
      amountIncomeReached: number;
      payableAmount: number;
    },
    {
      amountIncomeReached: number;
      payableAmount: number;
    },
    {
      amountIncomeReached: number;
      payableAmount: number;
    }
  ];
}

const ReactivationLevel = () => {
  const utils = trpc.useContext();
  const defaultValues: FormValues = {
    reactivation: [
      {
        amountIncomeReached: "" as any as number,
        payableAmount: "" as any as number,
      },
      {
        amountIncomeReached: "" as any as number,
        payableAmount: "" as any as number,
      },
      {
        amountIncomeReached: "" as any as number,
        payableAmount: "" as any as number,
      },
    ],
  };
  const validationSchema = yup.object({
    reactivation: yup.array(
      yup.object({
        amountIncomeReached: yup
          .number()
          .transform((value, originalValue) =>
            originalValue?.trim?.() === "" ? null : value
          )
          .required("Amount Income Reached is required"),
        payableAmount: yup
          .number()
          .transform((value, originalValue) =>
            originalValue?.trim?.() === "" ? null : value
          )
          .required("Payable Amount is required"),
      })
    ),
  });
  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, watch, setValue } = methods;
  const values = watch("reactivation");
  const { data, isLoading } = trpc.planSetting.getPlan.useQuery();
  const res = data! ?? {};
  const reactivation = res.reactivation;

  const { mutate, isLoading: isSubmitting } =
    trpc.planSetting.updateReactivation.useMutation({
      onSuccess(data, variables) {
        utils.planSetting.getPlan.setData(undefined, (data) => {
          return data ? { ...data, variables } : undefined;
        });
        stopEditing();
      },
    });
  const onSubmit = (formData: FormValues) => mutate(formData);

  useEffect(() => {
    if (reactivation && reactivation.length) {
      setValue("reactivation", reactivation);
    }
  }, [reactivation]);

  // edit form
  const { isEditing, stopEditing, startEditing } = useFormEdit();

  return (
    <Page title="Reactivation Level">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <HeaderBreadcrumbs
          heading="Reactivation Level"
          links={[{ name: "Reactivation Level" }]}
          action={
            isEditing ? (
              <>
                <Button onClick={stopEditing}>Cancel</Button>
                <LoadingButton type="submit" loading={isSubmitting}>
                  Submit
                </LoadingButton>
              </>
            ) : (
              <>
                <IconButton onClick={startEditing}>
                  <Iconify icon={IconifyIcons.pencil}></Iconify>
                </IconButton>
              </>
            )
          }
        />
        {isLoading && <LinearProgress />}
        <Grid container spacing={RESPONSIVE_GAP}>
          {values.map((_, index) => {
            return (
              <Grid key={index} item md={6} xs={12}>
                <Card>
                  <CardHeader
                    sx={{ bgcolor: "background.neutral" }}
                    title={`Reactivation Level ${index + 1}`}
                  />
                  <CardContent>
                    <Stack spacing={2}>
                      <RHFTextField
                        maskCurrency
                        disabled={!isEditing}
                        label="Amount Income Reached"
                        name={`reactivation.${index}.amountIncomeReached`}
                      />
                      <RHFTextField
                        maskCurrency
                        disabled={!isEditing}
                        label="Payable Amount"
                        name={`reactivation.${index}.payableAmount`}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </FormProvider>
    </Page>
  );
};

function FormCard() {
  const { fields, onAddField } = useFormRepeater({
    name: "details",
    append: {
      amountIncomeReached: "",
      payableAmount: "",
    },
  });
}

export default ReactivationLevel;
