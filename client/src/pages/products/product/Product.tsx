import { Grid } from "@mui/material";
import { useParams } from "react-router-dom";
import AnimatedBox from "../../../components/AnimatedBox";
import ApiError from "../../../components/ApiError";
import HeaderBreadcrumbs from "../../../components/HeaderBreadcrumbs";
import LoadingProgress from "../../../components/LoadingProgress";
import Page from "../../../components/Page";
import APP_PATH from "../../../routes/paths";
import { trpc } from "../../../trpc";
import ProductDetailsCarousel from "./ProductDetailsCarousel";
import ProductDetailsSummary from "./ProductDetailsSummary";

const Product = () => {
  const { _id } = useParams();
  if (!_id) return null;

  const { data, isLoading, error } = trpc.product.getProduct.useQuery(_id);
  if (isLoading) return <LoadingProgress />;
  if (error) return <ApiError error={error} />;
  const { name } = data!;

  return (
    <Page title={`${name}`}>
      <HeaderBreadcrumbs
        heading={`${name}`}
        links={[
          { name: "Products", href: APP_PATH.product.root },
          { name: ` ${name}` },
        ]}
      />

      <Grid container>
        <Grid item xs={12} md={6} lg={7}>
          <AnimatedBox>
            <ProductDetailsCarousel product={data!} />
          </AnimatedBox>
        </Grid>
        <Grid item xs={12} md={6} lg={5}>
          <ProductDetailsSummary product={data!} />
        </Grid>
      </Grid>
    </Page>
  );
};
export default Product;
