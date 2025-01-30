import { publicProcedure, trpc } from "../../trpc";
import { getConfigurationHandler } from "../controllers/setting.controller";

const configuration = publicProcedure.query(() => getConfigurationHandler());

export const settingRouter = trpc.router({
  configuration,
});
