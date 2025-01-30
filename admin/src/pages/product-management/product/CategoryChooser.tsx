import { MenuItem } from "@mui/material";
import { UseFormSetValue } from "react-hook-form";
import { RHFTextField } from "../../../components/hook-form";
import { trpc } from "../../../trpc";

const CategoryChooser = ({ setValue }: { setValue: UseFormSetValue<any> }) => {
  // get category list
  const { data } = trpc.category.getCategoryList.useQuery(
    {
      level: 1,
    },
    {
      staleTime: 0,
    }
  );
  const list = data! ?? [];
  return (
    <RHFTextField
      onChangeFn={(value: string) => {
        setValue("subCategoryId", "");
        setValue("subSubCategoryId", "");
      }}
      select
      name="categoryId"
      label="Category"
    >
      {list?.map((item) => {
        return (
          <MenuItem key={item._id} value={item._id}>
            {item.name}
          </MenuItem>
        );
      })}
    </RHFTextField>
  );
};
export default CategoryChooser;
