import { trpc, userProcedure } from "../../trpc";
import {
  downloadProductHandler,
  getOrdersHandler,
  getProductHandler,
  getProductsListHandler,
  purchaseProductHandler,
} from "../controllers/product.controller";
import { stringSchema } from "../schemas/index.schema";
import { getProductListSchema } from "../schemas/product.schema";
import { dataTableSchema } from "../schemas/table.schema";

const list = userProcedure
  .input(getProductListSchema)
  .query(({ input }) => getProductsListHandler({ input }));

const getProduct = userProcedure
  .input(stringSchema("Product Id"))
  .query(({ input, ctx }) => getProductHandler({ input, ctx }));

  const purchase = userProcedure
  .input(stringSchema("Product Id"))
  .mutation(({ ctx, input }) => purchaseProductHandler({ ctx, input }));
const orders = userProcedure
  .input(dataTableSchema)
  .query(({ ctx, input }) => getOrdersHandler({ ctx, input }));
const downloadProduct = userProcedure
  .input(stringSchema("Id"))
  .query(({ ctx, input }) => downloadProductHandler({ ctx, input }));

export const productRouter = trpc.router({
  list,
  purchase,
  getProduct,
  orders,
  downloadProduct,
});
