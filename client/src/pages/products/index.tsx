import { FilterProvider } from "./FilterProvider";
import Products from "./Products";

const _Products = () => {
  return (
    <FilterProvider>
      <Products />
    </FilterProvider>
  );
};

export default _Products;
