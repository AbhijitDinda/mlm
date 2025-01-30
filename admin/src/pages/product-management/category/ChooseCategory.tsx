import { MenuItem } from "@mui/material";
import { RHFTextField } from "../../../components/hook-form";
import { trpc } from "../../../trpc";

const ChooseCategory = ({
  level,
  isEditing,
}: {
  level: number;
  isEditing: boolean;
}) => {
  // get category list
  const { data } = trpc.category.getCategoryList.useQuery(
    {
      level: 1,
    },
    {
      enabled: level > 1,
    }
  );
  const list = data! ?? [];
  if (isEditing) return null;

  return level > 1 ? (
    <RHFTextField select name="categoryId" label="Category">
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
export default ChooseCategory;
