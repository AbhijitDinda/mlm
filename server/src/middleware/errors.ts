import { TRPCError } from "@trpc/server";
import { NextFunction, Request, Response } from "express";
import { NODE_ENV } from "../config";

export const AuthError = (message: string): never => {
  throw new TRPCError({
    code: "UNAUTHORIZED",
    message,
  });
};

export const ClientError = (message: string): never => {
  throw new TRPCError({
    code: "BAD_REQUEST",
    message,
  });
};

export const ServerError = (message: string): never => {
  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message,
  });
};
export const NOtFoundError = (message: string): never => {
  throw new TRPCError({
    code: "NOT_FOUND",
    message,
  });
};

export const HttpError = (
  message: string,
  code:
    | "BAD_REQUEST"
    | "PARSE_ERROR"
    | "INTERNAL_SERVER_ERROR"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "METHOD_NOT_SUPPORTED"
    | "TIMEOUT"
    | "CONFLICT"
    | "PRECONDITION_FAILED"
    | "PAYLOAD_TOO_LARGE"
    | "TOO_MANY_REQUESTS"
    | "CLIENT_CLOSED_REQUEST"
): never => {
  throw new TRPCError({
    code,
    message,
  });
};

export const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const success = err.success || false;
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";

  Error.captureStackTrace(err);

  res.status(status).json({
    success,
    status,
    toastMessage: message,
    stack: NODE_ENV === "development" ? err.stack : undefined,
  });
};
