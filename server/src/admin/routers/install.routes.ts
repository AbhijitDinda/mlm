import { publicProcedure, trpc } from "../../trpc";
import { installHandler } from "../controllers/setting.controller";
import { installSchema } from "../schemas/install.schema";

const setup = publicProcedure
  .input(installSchema)
  .mutation(({ input }) => installHandler(input));

export const installRouter = trpc.router({
  setup,
});
