import { trpc, userProcedure } from "../../trpc";
import { getEPinListHandler } from "../controllers/ePin.controller";
import { dataTableSchema } from "../schemas/table.schema";

const list = userProcedure
  .input(dataTableSchema)
  .query(({ input, ctx }) => getEPinListHandler({ input, ctx }));
export const ePinRouter = trpc.router({
  list,
});
