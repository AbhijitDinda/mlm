import { trpc, userProcedure } from "../../trpc";
import {
  changePasswordHandler,
  expireTokenHandler,
  getContactDetailsHandler,
  getLoginSessionHandler,
  getProfileHandler,
  getWalletDetailsHandler,
  logoutAllHandler,
  twoFaHandler,
  updateAvatarHandler,
  updateContactDetailsHandler,
  updateProfileHandler,
  verifyKycHandler,
} from "../controllers/profile.controller";
import { stringSchema } from "../schemas/index.schema";
import {
  changePasswordSchema,
  contactDetailsSchema,
  twoFaSchema,
  updateProfileSchema,
} from "../schemas/profile.schema";
import { dataTableSchema } from "../schemas/table.schema";

/**
 * get user profile
 */
const user = userProcedure.mutation(({ ctx }) => getProfileHandler({ ctx }));

/**
 * update user profile
 */
const updateUser = userProcedure
  .input(updateProfileSchema)
  .mutation(({ input, ctx }) => updateProfileHandler({ input, ctx }));

/**
 * get user wallet data
 */
const wallet = userProcedure.query(({ ctx }) =>
  getWalletDetailsHandler({ ctx })
);

/**
 * update user avatar
 */
const avatar = userProcedure
  .input(stringSchema("Avatar"))
  .mutation(({ input, ctx }) => updateAvatarHandler({ input, ctx }));

/**
 * update user password
 */
const changePassword = userProcedure
  .input(changePasswordSchema)
  .mutation(({ input, ctx }) => changePasswordHandler({ input, ctx }));

/**
 * get user contact details
 */
const getContactDetails = userProcedure.query(({ ctx }) =>
  getContactDetailsHandler({ ctx })
);

/**
 * update user contact details
 */
const updateContactDetails = userProcedure
  .input(contactDetailsSchema)
  .mutation(({ ctx, input }) => updateContactDetailsHandler({ ctx, input }));

/**
 * verify user kyc
 */
const verifyKyc = userProcedure.mutation(({ ctx }) =>
  verifyKycHandler({ ctx })
);

/**
 * get all login session table data
 */
const loginSession = userProcedure
  .input(dataTableSchema)
  .query(({ ctx, input }) => getLoginSessionHandler({ ctx, input }));

/**
 * expire a login session token
 */
const expireToken = userProcedure
  .input(stringSchema("Id"))
  .mutation(({ input }) => expireTokenHandler({ input }));

/**
 * logout user all login sessions
 */
const logoutAll = userProcedure.mutation(({ ctx }) =>
  logoutAllHandler({ ctx })
);

/**
 * manage two factor authentication
 */
const twoFa = userProcedure
  .input(twoFaSchema)
  .mutation(({ ctx, input }) => twoFaHandler({ ctx, input }));

export const profileRouter = trpc.router({
  user,
  updateUser,
  wallet,
  avatar,
  changePassword,
  getContactDetails,
  updateContactDetails,
  verifyKyc,
  loginSession,
  expireToken,
  logoutAll,
  twoFa,
});
