import { MenuItem } from "@mui/material";
import { UseFormSetValue } from "react-hook-form";
import { RHFTextField } from "../../../components/hook-form";
import { trpc } from "../../../trpc";

const SubCategoryChooser = ({
  categoryId,
  setValue,
}: {
  categoryId?: string;
  setValue: UseFormSetValue<any>;
}) => {
  const { data } = trpc.category.getCategoryList.useQuery(
    {
      level: 2,
      categoryId,
    },
    {
      staleTime: 0,
      enabled: !!categoryId,
    }
  );
  const list = data! ?? [];

  return (
    <RHFTextField
      onChangeFn={(value: string) => {
        setValue("subSubCategoryId", "");
      }}
      select
      name="subCategoryId"
      label="Sub Category"
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
export default SubCategoryChooser;
