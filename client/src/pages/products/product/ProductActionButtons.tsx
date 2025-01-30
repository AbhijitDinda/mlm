import { LoadingButton } from "@mui/lab";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router-dom";
import Iconify from "../../../components/Iconify";
import APP_PATH from "../../../routes/paths";
import { trpc } from "../../../trpc";
import { downloadProduct } from "../../orders/ProductDownload";
import { ProductDownload } from "./ProductDetailsSummary";

const ProductActionButtons = ({
  _id,
  download,
}: {
  _id: string;
  download: ProductDownload;
}) => {
  const utils = trpc.useContext();
  const confirm = useConfirm();
  const { status, id } = download;

  const navigate = useNavigate();
  const { mutate, isLoading } = trpc.product.purchase.useMutation({
    onSuccess() {
      utils.product.orders.invalidate();
      utils.product.getProduct.invalidate(_id);
      navigate(APP_PATH.order.root);
    },
  });

  const { download: _download, isDownloading } = downloadProduct(id!);

  const handleCheckout = async () => {
    try {
      await confirm({
        description: "Are you sure want to purchase this product?",
      });
      mutate(_id);
    } catch (error) {
      console.log("error->", error);
    }
  };

  return status ? (
    <>
      <LoadingButton
        loading={isDownloading}
        color="warning"
        onClick={() => _download()}
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        startIcon={
          <Iconify
            icon={"material-symbols:download-for-offline-outline-rounded"}
          />
        }
      >
        Download
      </LoadingButton>
    </>
  ) : (
    <LoadingButton
      loading={isLoading}
      onClick={handleCheckout}
      fullWidth
      size="large"
      type="submit"
      variant="contained"
      startIcon={<Iconify icon={"mingcute:shopping-bag-1-line"} />}
    >
      Purchase Now
    </LoadingButton>
  );
};

export default ProductActionButtons;
