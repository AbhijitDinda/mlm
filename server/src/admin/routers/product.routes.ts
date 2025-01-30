import { adminProcedure, trpc } from "../../trpc";
import {
  createProductHandler,
  getProductHandler,
  getProductListHandler,
  removeProductHandler,
} from "../controllers/product.controller";
import { stringSchema } from "../schemas/index.schema";
import { createProductSchema } from "../schemas/product.schema";
import { dataTableSchema } from "../schemas/table.schema";

const getProduct = adminProcedure
  .input(stringSchema("Id"))
  .query(({ input }) => getProductHandler({ input }));
const list = adminProcedure
  .input(dataTableSchema)
  .query(({ input }) => getProductListHandler({ input }));
const create = adminProcedure
  .input(createProductSchema)
  .mutation(({ input }) => createProductHandler({ input }));
const remove = adminProcedure
  .input(stringSchema("Id"))
  .mutation(({ input }) => removeProductHandler({ input }));

export const productRouter = trpc.router({
  getProduct,
  list,
  create,
  delete: remove,
});
