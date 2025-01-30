import { trpc, userProcedure } from "../../trpc";
import { getCategoryListHandler } from "../controllers/category.controller";
import { chooseCategorySchema } from "../schemas/category.schema";

const getCategoryList = userProcedure
  .input(chooseCategorySchema)
  .query(({ input }) => getCategoryListHandler({ input }));

export const categoryRouter = trpc.router({
  getCategoryList,
});
