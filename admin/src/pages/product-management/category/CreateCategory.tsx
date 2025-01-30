import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Box,
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
import IconifyIcons from "../../../IconifyIcons";
import FormLabel from "../../../components/FormLabel";
import Iconify from "../../../components/Iconify";
import {
  FormProvider,
  RHFTextField,
  RHFUploadAvatar,
} from "../../../components/hook-form";
import { trpc } from "../../../trpc";
import ChooseCategory from "./ChooseCategory";
import ChooseSubCategory from "./ChooseSubCategory";

interface FormValues {
  id?: string;
  category?: string;
  subCategory?: string;
  name: string;
  image: string;
  level: number;
  status: "active" | "inactive";
}

const CreateCategory = ({
  level,
  open,
  editId,
  onOpen,
  onClose,
  onSuccess,
}: {
  level: 1 | 2 | 3;
  open: boolean;
  editId?: string | null;
  onOpen: () => void;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const utils = trpc.useContext();
  const isEditing = !!editId;

  const defaultValues = {
    name: "",
    image: "",
    categoryId: "",
    subCategoryId: "",
    level,
    status: "" as "active" | "inactive",
  };
  const schema = yup.object({
    name: yup.string().required("Name is required"),
    image: yup.string().required("Image is required"),
    status: yup.string().required("Status is required"),
    ...(level > 1 && {
      categoryId: yup.string().required("Category is required"),
    }),
    ...(level > 2 && {
      subCategoryId: yup.string().required("Sub Category is required"),
    }),
  });
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { handleSubmit, setValue, reset, watch } = methods;
  const categoryId = watch("categoryId");

  useEffect(() => {
    setValue("subCategoryId", "");
  }, [categoryId]);

  // set data if edit
  const { data, isLoading } = trpc.category.getCategoryData.useQuery(editId!, {
    enabled: isEditing,
  });

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  const { mutate, isLoading: isSubmitting } =
    trpc.category.createCategory.useMutation({
      onSuccess() {
        onSuccess();
        utils.category.invalidate();
        reset();
      },
    });
  const onSubmit = (formData: FormValues) => mutate(formData);

  const categoryText =
    (level === 1 && "Category") ||
    (level === 2 && "Sub Category") ||
    "Sub Sub Category";

  return (
    <>
      <Button
        variant="contained"
        onClick={onOpen}
        startIcon={<Iconify icon={IconifyIcons.add} />}
      >
        Add {categoryText}
      </Button>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {isEditing ? "Update" : "Create"} {categoryText}
        </DialogTitle>
        {isEditing && isLoading && <LinearProgress />}
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={2}>
              <Box>
                <FormLabel label="Image" />
                <RHFUploadAvatar name="image" setValue={setValue} />
              </Box>
              <RHFTextField name="name" label="Name" />
              <RHFTextField select name="status" label="Status">
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">InActive</MenuItem>
              </RHFTextField>
              <ChooseCategory isEditing={isEditing} level={level} />
              <ChooseSubCategory
                isEditing={isEditing}
                categoryId={categoryId}
                level={level}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <LoadingButton loading={isSubmitting} type="submit">
              Submit
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
};
export default CreateCategory;
