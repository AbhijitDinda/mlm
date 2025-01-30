import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { FormProvider, RHFTextField } from "../../../components/hook-form";
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

export interface LabelFormValues {
  label: string;
  required: "required" | "optional";
  inputType: "date" | "input" | "textarea" | "file" | "dropdown";
  fileExtensions: FileExtensions;
  dropdownOptions: {
    option: string;
  }[];
}

const CreateLabelDialog = ({
  details,
  editId,
  onSuccess,
  open,
  onClose,
}: {
  details: LabelFormValues[];
  editId: number | null;
  onSuccess: (data: LabelFormValues) => void;
  open: boolean;
  onClose: () => void;
}) => {
  const isEditing = !!editId || editId === 0;

  const defaultValues: LabelFormValues = {
    label: "",
    required: "" as LabelFormValues["required"],
    inputType: "" as LabelFormValues["inputType"],
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
  const methods = useForm<LabelFormValues>({
    defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const onRequestClose = () => {
    reset();
    onClose();
  };

  const { handleSubmit, reset, watch, setValue, control } = methods;
  const onSubmit = (formData: LabelFormValues) => {
    onSuccess(formData);
    onRequestClose();
  };

  useEffect(() => {
    if (isEditing) {
      const editData = details?.[editId];
      editData ? reset(editData) : reset(defaultValues);
    }
  }, [editId]);

  const inputType = watch("inputType");
  const fileExtensions = watch("fileExtensions");
  const setFileExtensions = (value: FileExtensions) => {
    setValue("fileExtensions", value);
  };

  return (
    <Dialog open={open} onClose={onRequestClose}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle gutterBottom>
          {isEditing ? "Update" : "Create New"} Withdraw Detail
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <RHFTextField name="label" label="Label" variant="standard" />
            <RHFTextField
              select
              name="required"
              label="Required"
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
          <Button sx={{ textTransform: "uppercase" }} onClick={onRequestClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" sx={{ textTransform: "uppercase" }}>
            {isEditing ? "Update" : "Create"}
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

export default CreateLabelDialog;
