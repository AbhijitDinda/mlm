import { adminProcedure, trpc } from "../../trpc";
import {
  createFaqHandler,
  deleteFaqHandler,
  getFaqListHandler
} from "../controllers/faq.controller";
import { stringSchema } from "../schemas/index.schema";
import { createFaqSchema } from "../schemas/systemConfiguration.schema";

const list = adminProcedure.query(() => getFaqListHandler());
const create = adminProcedure
  .input(createFaqSchema)
  .mutation(({ input }) => createFaqHandler({ input }));
const remove = adminProcedure
  .input(stringSchema("Id"))
  .mutation(({ input }) => deleteFaqHandler({ input }));

export const faqRouter = trpc.router({
  create,
  delete: remove,
  list,
});
