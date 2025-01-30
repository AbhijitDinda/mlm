import { InputAdornment, Stack } from "@mui/material";
import DebouncedInput from "../../components/DebounceInput";
import Iconify from "../../components/Iconify";
import CategoryFilter from "./CategoryFilter";
import SortFilter from "./SortFilter";
import useProductFilter from "./FilterProvider";

const ProductFilter = () => {
  const { onChangeSearch } = useProductFilter();

  return (
    <Stack
      spacing={2}
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ sm: "center" }}
      justifyContent="space-between"
      sx={{ mb: 2 }}
    >
      <DebouncedInput
        placeholder="Search..."
        variant="standard"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={"eva:search-fill"}
                sx={{ color: "text.disabled", width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
        onChange={onChangeSearch}
      />

      <Stack direction="row" spacing={1}>
        <CategoryFilter />
        <SortFilter />
      </Stack>
    </Stack>
  );
};

export default ProductFilter;
