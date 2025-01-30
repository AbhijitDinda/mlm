import { adminProcedure, trpc } from "../../trpc";
import { getGenealogyHandler } from "../controllers//network.controller";

const genealogy = adminProcedure.query(({ ctx }) =>
  getGenealogyHandler({ ctx })
);

export const networkRouter = trpc.router({ genealogy });
