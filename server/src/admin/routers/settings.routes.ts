import { publicProcedure, trpc } from "../../trpc";
import {
  getConfigurationHandler,
  installHandler
} from "../controllers/setting.controller";
import { installSchema } from "../schemas/install.schema";

const install = publicProcedure
  .input(installSchema)
  .mutation(({ input }) => installHandler(input));

const configuration = publicProcedure.query(() => getConfigurationHandler());

export const settingRouter = trpc.router({
  install,
  configuration,
});
