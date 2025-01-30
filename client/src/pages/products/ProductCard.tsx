import { Box, Card, Link, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Image from "../../components/Image";
import Label from "../../components/Label";
import APP_PATH from "../../routes/paths";
import { fCurrency, fPercent } from "../../utils/formatNumber";
import { Product } from "./ProductsList";

// ----------------------------------------------------------------------

export const getPercentage = (mrp: number, price: number) => {
  let percent = (price / mrp) * 100;
  percent = 100 - percent;
  return fPercent(percent);
};

export default function ProductCard({ product }: { product: Product }) {
  const {
    name,
    thumbnail: image,
    purchasePrice: price,
    unitPrice: mrp,
    _id: productId,
  } = product;
  const linkTo = APP_PATH.product.view(productId);

  return (
    <Card elevation={8}>
      <Box sx={{ position: "relative", p: 1 }}>
        {price === 0 && (
          <Label
            variant="filled"
            color={"error"}
            sx={{
              top: 16,
              right: 16,
              zIndex: 9,
              position: "absolute",
              textTransform: "uppercase",
            }}
          >
            Free
          </Label>
        )}
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Image alt={name} src={image} ratio="1/1" sx={{ borderRadius: 2 }} />
        </Link>
      </Box>
      <Box sx={{ p: 3 }}>
        <Link to={linkTo} color="inherit" component={RouterLink}>
          <Typography variant="subtitle2" noWrap gutterBottom>
            {name}
          </Typography>
        </Link>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row">
            <Typography variant="subtitle1">{fCurrency(price)}</Typography>
            {mrp !== price && (
              <>
                <Typography
                  component="span"
                  variant="body1"
                  sx={{
                    color: "text.disabled",
                    textDecoration: "line-through",
                    mx: 1,
                  }}
                >
                  {fCurrency(mrp)}
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  sx={{ color: "success.main" }}
                >
                  {getPercentage(mrp, price)} off
                </Typography>
              </>
            )}
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
}
