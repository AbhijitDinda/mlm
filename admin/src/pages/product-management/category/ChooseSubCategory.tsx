import { MenuItem } from "@mui/material";
import { RHFTextField } from "../../../components/hook-form";
import { trpc } from "../../../trpc";

const ChooseSubCategory = ({
  level,
  categoryId,
  isEditing,
}: {
  level: number;
  categoryId: string;
  isEditing: boolean;
}) => {
  const { data } = trpc.category.getCategoryList.useQuery(
    {
      level: 2,
      categoryId: categoryId,
    },
    {
      enabled: level === 3 && !!categoryId,
    }
  );
  const list = data! ?? [];
  if (isEditing) return null;
  return level === 3 ? (
    <RHFTextField select name="subCategoryId" label="Sub Category">
      {list?.map((item) => {
        return (
          <MenuItem key={item._id} value={item._id}>
            {item.name}
          </MenuItem>
        );
      })}
    </RHFTextField>
  ) : null;
};
export default ChooseSubCategory;
