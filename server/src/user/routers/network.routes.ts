import { trpc, userProcedure } from "../../trpc";
import {
  getGenealogyHandler,
  getTreeHandler
} from "../controllers/network.controller";

const genealogy = userProcedure.query(({ ctx }) =>
  getGenealogyHandler({ ctx })
);
const tree = userProcedure.query(({ ctx }) => getTreeHandler({ ctx }));

export const networkRouter = trpc.router({
  genealogy,
  tree,
});
