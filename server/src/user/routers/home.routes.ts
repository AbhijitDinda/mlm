import { publicProcedure, trpc } from "../../trpc";
import {
  faqHandler,
  getSocialLinksHandler,
  homeHandler,
  planHandler,
  sendContactMail,
} from "../controllers/home.controller";
import { contactUsSchema } from "../schemas/home.schema";

const frontend = publicProcedure.query(() => homeHandler());
const socialLinks = publicProcedure.query(() => getSocialLinksHandler());
const faq = publicProcedure.query(() => faqHandler());
const plan = publicProcedure.query(() => planHandler());

const contact = publicProcedure
  .input(contactUsSchema)
  .mutation(({ input }) => sendContactMail({ input }));

export const homeRouter = trpc.router({
  contact,
  frontend,
  faq,
  plan,
  socialLinks,
});
