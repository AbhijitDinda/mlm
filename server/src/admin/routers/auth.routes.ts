import { publicProcedure, trpc } from "../../trpc";
import { loginHandler } from "../controllers/auth.controller";
import { loginAdminSchema } from "../schemas/auth.schema";

const login = publicProcedure
  .input(loginAdminSchema)
  .mutation(({ input, ctx: { req } }) =>
    loginHandler(input, req.ip, req.useragent)
  );

export const authRouter = trpc.router({
  login,
});
