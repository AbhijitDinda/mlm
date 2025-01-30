import { inferAsyncReturnType } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { deserializeUser } from "./middleware/deserializeUser";

export const createContext = async ({
  req,
  res,
}: CreateExpressContextOptions) => ({
  req,
  res,
  user: await deserializeUser({ req, res, isAdmin: false }),
});

export type UserContext = inferAsyncReturnType<typeof createContext>;
export type AdminContext = Omit<
  Omit<UserContext, "user"> & { admin: UserContext["user"] },
  ""
>;
