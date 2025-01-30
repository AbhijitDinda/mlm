import { adminProcedure, trpc } from "../../trpc";
import {
  addBalanceHandler,
  getUserListHandler,
  getUserLoginTokenHandler,
  getUserProfileHandler,
  updateUserProfileHandler,
  updateUserStatusHandler,
  withdrawBalanceHandler
} from "../controllers//user.controller";
import { numberSchema } from "../schemas/index.schema";
import { userTableSchema } from "../schemas/table.schema";
import {
  changeStatusUserSchema,
  depositSchema,
  updateProfileSchema,
  withdrawSchema
} from "../schemas/user.schema";

const list = adminProcedure
  .input(userTableSchema)
  .query(({ input }) => getUserListHandler({ input }));

const getProfile = adminProcedure
  .input(numberSchema("Id"))
  .query(({ input }) => getUserProfileHandler({ input }));

const updateProfile = adminProcedure
  .input(updateProfileSchema)
  .mutation(({ input }) => updateUserProfileHandler({ input }));

const status = adminProcedure
  .input(changeStatusUserSchema)
  .mutation(({ input }) => updateUserStatusHandler({ input }));

const deposit = adminProcedure
  .input(depositSchema)
  .mutation(({ input, ctx }) => addBalanceHandler({ input, ctx }));

const withdraw = adminProcedure
  .input(withdrawSchema)
  .mutation(({ input, ctx }) => withdrawBalanceHandler({ input, ctx }));

const token = adminProcedure
  .input(numberSchema("Id"))
  .mutation(({ input, ctx: { req } }) =>
    getUserLoginTokenHandler({ input, ip: req.ip, userAgent: req.useragent })
  );

export const userRouter = trpc.router({
  list,
  getProfile,
  updateProfile,
  status,
  deposit,
  withdraw,
  token,
});
