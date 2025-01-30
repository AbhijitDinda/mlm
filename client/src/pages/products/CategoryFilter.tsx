import {
  Box,
  Button,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  SwipeableDrawer,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Iconify from "../../components/Iconify";
import { NAVBAR } from "../../config";
import { trpc } from "../../trpc";
import useProductFilter from "./FilterProvider";

const CategoryFilter = () => {
  const { category, onChangeCategory, onResetAll, isDefaultFilter } =
    useProductFilter();

  const [open, setOpen] = useState(false);
  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setOpen(open);
    };
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const { data: categories, isLoading } =
    trpc.category.getCategoryList.useQuery({
      level: 1,
    });

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={<Iconify icon={"ic:round-filter-list"} />}
        onClick={onOpen}
      >
        Filters
      </Button>
      <SwipeableDrawer
        anchor={"right"}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        PaperProps={{
          sx: { width: NAVBAR.BASE_WIDTH },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Filters
          </Typography>
          <IconButton onClick={onClose}>
            <Iconify icon={"eva:close-fill"} width={20} height={20} />
          </IconButton>
        </Stack>
        <Divider />

        <Stack spacing={3} sx={{ p: 3 }}>
          <TextField
            label="Category"
            select
            value={category}
            onChange={(
              e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => {
              onChangeCategory(e.target.value);
            }}
          >
            {categories ? (
              categories?.map((item) => {
                return (
                  <MenuItem key={item._id} value={item._id}>
                    {item.name}
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem>No Category</MenuItem>
            )}
          </TextField>
          <SubCategoryChooser />
          <SubSubCategoryChooser />
        </Stack>

        {!isDefaultFilter && (
          <Box sx={{ p: 3 }}>
            <Button
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              variant="outlined"
              onClick={onResetAll}
              startIcon={<Iconify icon={"ic:round-clear-all"} />}
            >
              Clear All
            </Button>
          </Box>
        )}
      </SwipeableDrawer>
    </>
  );
};

function SubCategoryChooser() {
  const { category, subCategory, onChangeSubCategory } = useProductFilter();
  const { data, isLoading } = trpc.category.getCategoryList.useQuery({
    level: 2,
    categoryId: category,
  });
  const categories = data! ?? [];

  useEffect(() => {
    onChangeSubCategory("");
  }, [category]);

  if (!category || isLoading || !categories.length) return null;
  return (
    <TextField
      label="Sub Category"
      select
      value={subCategory}
      onChange={(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        onChangeSubCategory(e.target.value);
      }}
    >
      {categories?.map((item) => {
        return (
          <MenuItem key={item._id} value={item._id}>
            {item.name}
          </MenuItem>
        );
      })}
    </TextField>
  );
}

function SubSubCategoryChooser() {
  const { category, subCategory, subSubCategory, onChangeSubSubCategory } =
    useProductFilter();

  const { data, isLoading } = trpc.category.getCategoryList.useQuery({
    level: 3,
    categoryId: category,
    subCategoryId: subCategory,
  });
  const categories = data! ?? [];

  useEffect(() => {
    onChangeSubSubCategory("");
  }, [category, subCategory]);

  if (!category || !subCategory || isLoading || !categories.length) return null;
  return (
    <TextField
      label="Sub Sub Category"
      select
      value={subSubCategory}
      onChange={(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        onChangeSubSubCategory(e.target.value);
      }}
    >
      {categories?.map((item) => {
        return (
          <MenuItem key={item._id} value={item._id}>
            {item.name}
          </MenuItem>
        );
      })}
    </TextField>
  );
}

export default CategoryFilter;
