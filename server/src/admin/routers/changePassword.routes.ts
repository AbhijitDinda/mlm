import { adminProcedure, trpc } from "../../trpc";
import { updateAdminPasswordHandler } from "../controllers/changePassword.controller";
import { changePasswordSchema } from "../schemas/changePassword.schema";

const update = adminProcedure
  .input(changePasswordSchema)
  .mutation(({ ctx, input }) => updateAdminPasswordHandler({ ctx, input }));

export const changePasswordRouter = trpc.router({ update });
