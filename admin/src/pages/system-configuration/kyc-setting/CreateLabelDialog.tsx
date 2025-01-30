import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { FormProvider, RHFTextField } from "../../../components/hook-form";
import { trpc } from "../../../trpc";
import DropDownOptionFields from "./DropDownOptionFields";
import FileExtensionsInput from "./FileExtensionsInput";

export type FileExtensions = (
  | "JPG"
  | "JPEG"
  | "PNG"
  | "WEBP"
  | "PDF"
  | "DOC"
  | "DOCX"
  | "TXT"
  | "XLX"
  | "XLSX"
  | "CSV"
)[];

export interface FormValues {
  _id?: string;
  label: string;
  required: "required" | "optional";
  inputType: "date" | "input" | "textarea" | "file" | "dropdown";
  fileExtensions: FileExtensions;
  dropdownOptions: {
    option: string;
  }[];
}

const CreateLabelDialog = ({
  editId = null,
  open,
  onClose,
}: {
  editId: string | null;
  open: boolean;
  onClose: () => void;
}) => {
  const utils = trpc.useContext();
  const { data, isLoading } = trpc.systemConfiguration.kyc.list.useQuery();
  const defaultValues: FormValues = {
    _id: undefined,
    label: "",
    required: "" as FormValues["required"],
    inputType: "" as FormValues["inputType"],
    fileExtensions: [] as FileExtensions,
    dropdownOptions: [{ option: "" }],
  };

  const validationSchema = yup.object().shape({
    label: yup.string().required("Label is required"),
    required: yup.string().required("Required is required"),
    inputType: yup.string().required("Input Type is required"),
    fileExtensions: yup.array().when("inputType", {
      is: (val: string) => val === "file",
      then(schema) {
        return yup.array().min(1, "File Extensions is required");
      },
    }),
    dropdownOptions: yup.array().when("inputType", {
      is: (val: string) => val === "dropdown",
      then(schema) {
        return yup
          .array()
          .of(
            yup.object().shape({
              option: yup.string().required("Option is required"),
            })
          )
          .min(1, "One Option is required");
      },
    }),
  });

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { handleSubmit, reset, watch, setValue, control } = methods;

  // create
  const { mutate, isLoading: isSubmitting } =
    trpc.systemConfiguration.kyc.create.useMutation({
      onSuccess({ data }) {
        console.log("onSuccess ~ data:", data);
        utils.systemConfiguration.kyc.list.setData(undefined, (lists) => {
          if (!lists) return [data];
          const index = lists.findIndex((item) => item._id === data._id);
          if (index !== -1) {
            return lists.map((list) => (list._id === data._id ? data : list));
          } else {
            return [...lists, data];
          }
        });
        reset();
        onClose();
      },
    });

  // @ts-ignore
  const onSubmit = (formData: FormValues) => mutate(formData);

  const inputType = watch("inputType");
  const fileExtensions = watch("fileExtensions");
  const setFileExtensions = (value: FileExtensions) =>
    setValue("fileExtensions", value);

  useEffect(() => {
    if (data && editId) {
      const row = data.find((list) => list._id === editId);
      data.length && row && reset(row);
    }
  }, [data]);

  return (
    <Dialog open={open} onClose={onClose}>
      {isLoading && <LinearProgress />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle gutterBottom>
          {editId ? "Update Kyc Form Label" : "Create New Kyc Form Label"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <RHFTextField name="label" label="Label" variant="standard" />
            <RHFTextField
              select
              name="required"
              label="Is Required"
              variant="standard"
            >
              <MenuItem value="optional">Optional</MenuItem>
              <MenuItem value="required">Required</MenuItem>
            </RHFTextField>
            <RHFTextField
              select
              name="inputType"
              label="Input Type"
              variant="standard"
            >
              <MenuItem value="input">Input</MenuItem>
              <MenuItem value="textarea">TextArea</MenuItem>
              <MenuItem value="dropdown">Dropdown</MenuItem>
              <MenuItem value="file">File</MenuItem>
              <MenuItem value="date">Date</MenuItem>
            </RHFTextField>

            {inputType === "file" && (
              <FileExtensionsInput
                fileExtensions={fileExtensions}
                setFileExtensions={setFileExtensions}
                name={"fileExtensions"}
              />
            )}

            {inputType === "dropdown" && <DropDownOptionFields />}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button sx={{ textTransform: "uppercase" }} onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            sx={{ textTransform: "uppercase" }}
          >
            {editId ? "Update" : "Create"}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default CreateLabelDialog;
