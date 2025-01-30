import { adminProcedure, trpc } from "../../trpc";
import { getAdminProfileHandler } from "../controllers//profile.controller";

const user = adminProcedure.mutation(({ ctx }) =>
  getAdminProfileHandler({ ctx })
);
export const profileRouter = trpc.router({ user });
