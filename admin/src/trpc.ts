import { createTRPCReact, TRPCClientError, TRPCLink } from "@trpc/react-query";
import { inferRouterOutputs } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import { toast } from "react-toastify";
import type { AdminAppRouter } from "../../server/src/app";
import { globals } from "./utils/globals";

function isObject(value: unknown): value is object {
  return typeof value === "object" && value !== null;
}

export const customLink: TRPCLink<AdminAppRouter> = () => {
  return ({ next, op }) => {
    return observable((observer) => {
      const unsubscribe = next(op).subscribe({
        next(value) {
          const { result } = value;
          if ("data" in result) {
            const { data } = result;
            if (isObject(data) && "toastMessage" in data) {
              const message: string = data.toastMessage as string;
              toast.success(message);
            }
          }
          observer.next(value);
        },
        error(err) {
          const message = err.message;
          toast.error(message);
          observer.error(err);
          if (err?.data?.code === "UNAUTHORIZED") {
            globals?.logout?.();
          }
        },
        complete() {
          observer.complete();
        },
      });
      return unsubscribe;
    });
  };
};

export const trpc = createTRPCReact<AdminAppRouter>({});
export type RouterOutput = inferRouterOutputs<AdminAppRouter>;
export function isTRPCClientError(
  cause: unknown
): cause is TRPCClientError<AdminAppRouter> {
  return cause instanceof TRPCClientError;
}
