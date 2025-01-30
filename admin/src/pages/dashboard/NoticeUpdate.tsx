import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import Editor from "../../components/Editor";
import FormLabel from "../../components/FormLabel";
import { FormProvider, RHFTextField } from "../../components/hook-form";
import Iconify from "../../components/Iconify";
import IconifyIcons from "../../IconifyIcons";
import { trpc } from "../../trpc";

interface FormValues {
  notice: string;
}

const NoticeUpdate = () => {
  const utils = trpc.useContext();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const defaultValues = {
    notice: "",
  };
  const FormSchema = yup.object().shape({
    notice: yup.string().required("Notice is required"),
  });

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(FormSchema),
  });
  const { getValues, reset, setValue, handleSubmit } = methods;

  // get
  const { data } = trpc.dashboard.getNotice.useQuery();

  useEffect(() => {
    data && reset({ notice: data });
  }, [data]);

  // mutate
  const { mutate, isLoading: isSubmitting } =
    trpc.dashboard.updateNotice.useMutation({
      onSuccess(data, input) {
        utils.dashboard.getNotice.invalidate();
        // utils.dashboard.getNotice.setData(undefined, input.notice);
        handleClose();
      },
    });

  const onChangeValue = (value: string) => setValue("notice", value);
  const onSubmit = (formData: FormValues) => mutate(formData);

  return (
    <>
      <Dialog open={open} maxWidth={"xl"} onClose={handleClose}>
        <DialogTitle>Update Notice</DialogTitle>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Box>
              <FormLabel label="Description" />
              <Editor
                onChangeValue={onChangeValue}
                initialValue={getValues().notice}
              />
              <RHFTextField
                sx={{ "& fieldset": { display: "none" } }}
                name="notice"
                type="hidden"
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ py: 0 }}>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <LoadingButton type="submit" loading={isSubmitting}>
              Update
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
      <IconButton onClick={handleOpen}>
        <Iconify icon={IconifyIcons.pencil} color="#fff" />
      </IconButton>
    </>
  );
};

export default NoticeUpdate;
