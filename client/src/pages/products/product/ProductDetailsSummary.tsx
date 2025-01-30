import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import AnimatedBox from "../../../components/AnimatedBox";
import { RouterOutput } from "../../../trpc";
import { getDiscount } from "../../../utils/fns";
import { fCurrency } from "../../../utils/formatNumber";
import ProductActionButtons from "./ProductActionButtons";

// ----------------------------------------------------------------------

export type Product = RouterOutput["product"]["getProduct"];
export type ProductDownload = Product["download"];

const ProductDetailsSummary = ({ product }: { product: Product }) => {
  const {
    name,
    purchasePrice,
    unitPrice,
    _id,
    description,
    category,
    subCategory,
    subSubCategory,
    download,
  } = product;

  return (
    <Box sx={{ py: 1 }}>
      <Stack spacing={1}>
        <AnimatedBox>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6">{name}</Typography>
                <Typography variant="h4" sx={{ mb: 3 }}>
                  &nbsp;{fCurrency(purchasePrice)}
                  {purchasePrice !== unitPrice && (
                    <>
                      <Box
                        component="span"
                        sx={{
                          mx: 1,
                          color: "text.disabled",
                          textDecoration: "line-through",
                          fontSize: 18,
                        }}
                      >
                        {unitPrice && fCurrency(unitPrice)}
                      </Box>
                      <Box
                        component="span"
                        sx={{ color: "success.main", fontSize: 16 }}
                      >
                        {getDiscount(unitPrice, purchasePrice)}% off
                      </Box>
                    </>
                  )}
                </Typography>

                <Typography variant="h6">Description</Typography>
                <Typography color="text.secondary" whiteSpace={"pre-wrap"}>
                  {description}
                </Typography>

                <Typography variant="h6">Category</Typography>
                <Typography color="text.secondary" whiteSpace={"pre-wrap"}>
                  {category.name}
                </Typography>

                {subCategory && (
                  <>
                    <Typography variant="h6">Sub Category</Typography>
                    <Typography color="text.secondary" whiteSpace={"pre-wrap"}>
                      {subCategory.name}
                    </Typography>
                  </>
                )}

                {subSubCategory && (
                  <>
                    <Typography variant="h6">Sub Sub Category</Typography>
                    <Typography color="text.secondary" whiteSpace={"pre-wrap"}>
                      {subSubCategory.name}
                    </Typography>
                  </>
                )}
              </Stack>
            </CardContent>
          </Card>
        </AnimatedBox>

        <AnimatedBox>
          <ProductActionButtons download={download} _id={_id} />
        </AnimatedBox>
      </Stack>
    </Box>
  );
};
export default ProductDetailsSummary;
