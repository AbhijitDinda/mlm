import { MenuItem } from "@mui/material";
import { RHFTextField } from "../../../components/hook-form";
import { trpc } from "../../../trpc";

const SubSubCategoryChooser = ({
  categoryId,
  subCategoryId,
}: {
  categoryId?: string;
  subCategoryId?: string;
}) => {
  const { data } = trpc.category.getCategoryList.useQuery(
    {
      level: 3,
      categoryId,
      subCategoryId,
    },
    {
      staleTime: 0,
      enabled: !!categoryId && !!subCategoryId,
    }
  );
  const list = data! ?? [];

  return (
    <RHFTextField select name="subSubCategoryId" label="Sub Sub Category">
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
export default SubSubCategoryChooser;
