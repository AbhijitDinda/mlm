import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import { UserContext } from "./context";
import { AuthError } from "./middleware/errors";

export const trpc = initTRPC.context<UserContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.format()
            : null,
      },
    };
  },
});

export const isUserMiddleware = trpc.middleware(({ ctx, next }) => {
  if (!ctx.user)
    throw AuthError("You must be logged in to access this resource");
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const isAdminMiddleware = trpc.middleware(({ ctx, next }) => {
  if (!ctx.user)
    throw AuthError("You must be logged in to access this resource");
  if (!ctx.user.isAdmin())
    throw AuthError("You must be logged in to access this resource");
  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
      admin: ctx.user,
    },
  });
});

export const userProcedure = trpc.procedure.use(isUserMiddleware);
export const adminProcedure = trpc.procedure.use(isAdminMiddleware);
export const publicProcedure = trpc.procedure;
