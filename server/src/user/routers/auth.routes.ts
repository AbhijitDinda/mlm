import { publicProcedure, trpc } from "../../trpc";
import {
  checkPlacementIdHandler,
  checkPlacementSideHandler,
  checkReferralIdHandler,
  checkUserNameHandler,
  forgotPasswordHandler,
  getNewUserHandler,
  loginHandler,
  registerHandler,
  resetPasswordHandler,
} from "../controllers/auth.controller";
import {
  createUserSchema,
  loginUserSchema,
  newUserSchema,
  resetPasswordSchema,
} from "../schemas/auth.schema";
import { stringSchema } from "../schemas/index.schema";

const register = publicProcedure
  .input(createUserSchema)
  .mutation(({ input }) => registerHandler(input));

const login = publicProcedure
  .input(loginUserSchema)
  .mutation(({ input, ctx: { req } }) =>
    loginHandler(input, req.ip, req.useragent)
  );

const newUser = publicProcedure
  .input(newUserSchema)
  .query(({ input }) => getNewUserHandler(input));

const forgotPassword = publicProcedure
  .input(stringSchema("User Id or User name is required"))
  .mutation(({ input }) => forgotPasswordHandler({ input }));

const resetPassword = publicProcedure
  .input(resetPasswordSchema)
  .mutation(({ input }) => resetPasswordHandler({ input }));

const checkReferralId = publicProcedure
  .input(stringSchema("Referral Id is required"))
  .mutation(({ input }) => checkReferralIdHandler({ input }));

const checkPlacementId = publicProcedure
  .input(stringSchema("Placement Id is required"))
  .mutation(({ input }) => checkPlacementIdHandler({ input }));

const checkUserName = publicProcedure
  .input(stringSchema("Referral Id is required"))
  .mutation(({ input }) => checkUserNameHandler({ input }));

const checkPlacementSide = publicProcedure
  .input(stringSchema("Placement Id is required"))
  .mutation(({ input }) => checkPlacementSideHandler({ input }));

export const authRouter = trpc.router({
  newUser,
  login,
  register,
  forgotPassword,
  resetPassword,
  checkReferralId,
  checkPlacementId,
  checkUserName,
  checkPlacementSide,
});
