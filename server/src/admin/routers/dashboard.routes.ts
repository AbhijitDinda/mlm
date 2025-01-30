import { adminProcedure, trpc } from "../../trpc";
import {
  getDashboardCardsHandler,
  getNoticeHandler,
  updateUpdateNoticeHandler
} from "../controllers//dashboard.controller";
import { noticeUpdateSchema } from "../schemas/dashboard.schema";

const cards = adminProcedure.query(() => getDashboardCardsHandler());
const getNotice = adminProcedure.query(() => getNoticeHandler());
const updateNotice = adminProcedure
  .input(noticeUpdateSchema)
  .mutation(({ input }) => updateUpdateNoticeHandler({ input }));

export const dashboardRouter = trpc.router({
  cards,
  getNotice,
  updateNotice,
});
