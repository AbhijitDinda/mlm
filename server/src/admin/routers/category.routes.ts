import { adminProcedure, trpc } from "../../trpc";
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getCategoriesList,
  getCategoryDataHandler,
  getCategoryListHandler,
} from "../controllers/category.controller";
import { chooseCategorySchema } from "../schemas/category.schema";
import { stringSchema } from "../schemas/index.schema";
import {
  categoryTblSchema,
  createCategorySchema,
} from "../schemas/product.schema";

const list = adminProcedure
  .input(categoryTblSchema)
  .query(({ input }) => getCategoriesList({ input }));

const createCategory = adminProcedure
  .input(createCategorySchema)
  .mutation(({ input }) => createCategoryHandler({ input }));

const remove = adminProcedure
  .input(stringSchema("Id"))
  .mutation(({ input }) => deleteCategoryHandler({ input }));

const getCategoryData = adminProcedure
  .input(stringSchema("Id"))
  .query(({ input }) => getCategoryDataHandler({ input }));

const getCategoryList = adminProcedure
  .input(chooseCategorySchema)
  .query(({ input }) => getCategoryListHandler({ input }));

export const categoryRouter = trpc.router({
  list,
  getCategoryData,
  createCategory,
  remove,
  getCategoryList,
});
