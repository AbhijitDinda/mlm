import { trpc, userProcedure } from "../../trpc";
import {
  getDashboardCardsHandler,
  getNoticeHandler,
  getReactivationNotice,
} from "../controllers/dashboard.controller";

const cards = userProcedure.query(({ ctx }) =>
  getDashboardCardsHandler({ ctx })
);
const notice = userProcedure.query(() => getNoticeHandler());
const reactivation = userProcedure.query(({ ctx }) => getReactivationNotice({ ctx }));

export const dashboardRouter = trpc.router({
  cards,
  notice,
  reactivation,
});
