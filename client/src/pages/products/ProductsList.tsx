import { Box } from "@mui/material";
import { SkeletonProductItem } from "../../components/skeleton";
import { RESPONSIVE_GAP } from "../../config";
import { RouterOutput } from "../../trpc";
import useProductFilter from "./FilterProvider";
import ProductCard from "./ProductCard";

// ----------------------------------------------------------------------

type Data = RouterOutput["product"]["list"];
export type Product = RouterOutput["product"]["list"]["rows"][number];

const ProductsList = () => {
  const { isFetching, products } = useProductFilter();
  return (
    <Box
      sx={{
        display: "grid",
        gap: RESPONSIVE_GAP,
        gridTemplateColumns: {
          xs: "repeat(1, 1fr)",
          sm: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(4, 1fr)",
        },
      }}
    >
      {(isFetching ? [...Array(12)] : products).map((product: Product, index) =>
        product ? (
          <ProductCard key={product._id} product={product} />
        ) : (
          <SkeletonProductItem key={index} />
        )
      )}
    </Box>
  );
};

export default ProductsList;
