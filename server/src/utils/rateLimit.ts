import rateLimit from "express-rate-limit";
import { HttpError } from "../middleware/errors";
import { TRPCError } from "@trpc/server";

export const getLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1000,
  message: {
    toastMessage: "Too many requests",
  }, // legacyHeaders: false,
});

export const postLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 1,
  message: () => {
    return new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: "Too many requests",
    });
  },
  // legacyHeaders: false,
});
