import { LoadingButton } from "@mui/lab";
import { trpc } from "../../../trpc";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router-dom";
import APP_PATH from "../../../routes/paths";

const DeleteProduct = ({ id }: { id?: string }) => {
  const navigate = useNavigate();
  const utils = trpc.useContext();
  const confirm = useConfirm();
  const { mutate, isLoading } =
    trpc.product.delete.useMutation({
      onSuccess() {
        navigate(APP_PATH.productManagement.product.list);
        utils.product.invalidate();
      },
    });

  const handleRemove = async () => {
    try {
      await confirm({
        description: "Are you sure you want to delete this product?",
      });
      mutate(id!);
    } catch (error) {
      console.log("error->", error);
    }
  };

  return !id ? (
    <div></div>
  ) : (
    <LoadingButton
      loading={isLoading}
      onClick={handleRemove}
      color="error"
      variant="contained"
    >
      Delete Product
    </LoadingButton>
  );
};
export default DeleteProduct;
