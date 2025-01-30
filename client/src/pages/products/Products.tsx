import { Card } from "@mui/material";
import ApiError from "../../components/ApiError";
import EmptyContent from "../../components/EmptyContent";
import HeaderBreadcrumbs from "../../components/HeaderBreadcrumbs";
import Page from "../../components/Page";
import useProductFilter from "./FilterProvider";
import ProductFilter from "./ProductFilter";
import ProductPagination from "./ProductPagination";
import ProductsList from "./ProductsList";

const Products = () => {
  const { error, isFetching, resultCount } = useProductFilter();

  if (error) return <ApiError error={error} />;
  return (
    <Page title="E-Books" animate={false}>
      {/* Breadcrumb Start */}
      <HeaderBreadcrumbs heading="E-Books" links={[{ name: "E-Books" }]} />
      {/* Breadcrumb End */}

      <ProductFilter />

      {!isFetching && !resultCount && (
        <Card sx={{ height: 600 }}>
          <EmptyContent
            title="No data available"
            description="No e-books found."
          />
        </Card>
      )}
      <ProductsList />
      <ProductPagination />
    </Page>
  );
};

export default Products;
