import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  Stack,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import ApiError from "../../../components/ApiError";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import LoadingProgress from "../../../components/LoadingProgress";
import Page from "../../../components/Page";
import {
  FormProvider,
  RHFTextField,
  RHFUploadMultiFile,
  RHFUploadSingleFile,
} from "../../../components/hook-form";
import { RESPONSIVE_GAP } from "../../../config";
import APP_PATH from "../../../routes/paths";
import { trpc } from "../../../trpc";
import CategoryChooser from "./CategoryChooser";
import DeleteProduct from "./DeleteProduct";
import SubCategoryChooser from "./SubCategoryChooser";
import SubSubCategoryChooser from "./SubSubCategoryChooser";

interface FormValues {
  name: string;
  description: string;
  categoryId: string;
  subCategoryId?: string;
  subSubCategoryId?: string;
  thumbnail: string;
  unitPrice: number;
  purchasePrice: number;
  images: string[];
  file: string;
  status: "active" | "inactive";
}

const CreateProduct = () => {
  const params = useParams();
  const { id } = params;
  const navigate = useNavigate();
  const utils = trpc.useContext();
  const isEditing = !!id;

  const defaultValues: FormValues = {
    name: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
    subSubCategoryId: "",
    thumbnail: "",
    unitPrice: "" as any as number,
    purchasePrice: "" as any as number,
    images: [],
    file: "",
    status: "" as "active" | "inactive",
  };
  const schema = yup.object({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Description is required"),
    status: yup.string().required("Status is required"),
    thumbnail: yup.string().required("Thumbnail is required"),
    categoryId: yup.string().required("Category is required"),
    images: yup
      .array(yup.string().required("Image is required"))
      .min(1, "Minimum 1 Image is required"),
    file: yup.string().required("File is required"),
    unitPrice: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Unit Price is required"),
    purchasePrice: yup
      .number()
      .transform((value, originalValue) =>
        originalValue?.trim?.() === "" ? null : value
      )
      .required("Unit Price is required"),
  });
  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { handleSubmit, setValue, getValues, reset, watch } = methods;

  const category = watch("categoryId");
  const subCategory = watch("subCategoryId");

  // get
  const { data, isLoading, error } = trpc.product.getProduct.useQuery(id!, {
    enabled: isEditing,
  });

  useEffect(() => {
    if (id && data) {
      reset(data);
    }
  }, [data, id]);



  //
  const { mutate, isLoading: isSubmitting } = trpc.product.create.useMutation({
    onSuccess() {
      navigate(APP_PATH.productManagement.product.list);
      utils.product.invalidate();
    },
  });
  const onSubmit = (formData: FormValues) => mutate(formData);

  if (error) return <ApiError error={error} />;

  return (
    <Page title={isEditing ? "Update Product" : "Create Product"}>
      <HeaderBreadcrumbs
        heading={isEditing ? "Update Product" : "Create Product"}
        links={[
          { name: "Products" },
          { name: isEditing ? "Update Product" : "Create Product" },
        ]}
      />

      {isEditing && isLoading && <LoadingProgress />}
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={RESPONSIVE_GAP}>
        <Grid item md={7} xs={12}>
            <Card>
              <CardHeader
                sx={{ bgcolor: "background.neutral" }}
                title="Product Information"
              />
              <CardContent>
                <Stack spacing={2}>
                  <RHFTextField label="Name" name="name" />
                  <RHFTextField
                    multiline
                    minRows={4}
                    label="Description"
                    name="description"
                  />
                  <RHFTextField label="Status" name="status" select>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </RHFTextField>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={5} xs={12}>
            <Card>
              <CardHeader
                sx={{ bgcolor: "background.neutral" }}
                title="Thumbnail"
              />
              <CardContent>
                <RHFUploadSingleFile name="thumbnail" setValue={setValue} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={6} xs={12}>
            <Card>
              <CardHeader
                sx={{ bgcolor: "background.neutral" }}
                title="Product price"
              />
              <CardContent>
                <Stack spacing={2}>
                  <RHFTextField
                    maskCurrency
                    label="Unit Price"
                    name="unitPrice"
                  />
                  <RHFTextField
                    maskCurrency
                    label="Purchase Price"
                    name="purchasePrice"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={6} xs={12}>
            <Card>
              <CardHeader
                sx={{ bgcolor: "background.neutral" }}
                title="Category"
              />
              <CardContent>
                <Stack spacing={2}>
                  <CategoryChooser setValue={setValue} />
                  <SubCategoryChooser
                    categoryId={category}
                    setValue={setValue}
                  />
                  <SubSubCategoryChooser
                    categoryId={category}
                    subCategoryId={subCategory}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                sx={{ bgcolor: "background.neutral" }}
                title="Product Images"
              />
              <CardContent>
                <RHFUploadMultiFile
                  name="images"
                  setValue={setValue}
                  getValues={getValues}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader
                sx={{ bgcolor: "background.neutral" }}
                title="Product"
              />
              <CardContent>
                <RHFUploadSingleFile
                  isPrivate
                  accept="all"
                  name="file"
                  setValue={setValue}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid
            sx={{ display: "flex", justifyContent: "space-between" }}
            item
            xs={12}
          >
            <DeleteProduct id={id} />
            <LoadingButton
              type="submit"
              variant="contained"
              loading={isSubmitting}
            >
              Submit
            </LoadingButton>
          </Grid>
        </Grid>
      </FormProvider>
    </Page>
  );
};
export default CreateProduct;
