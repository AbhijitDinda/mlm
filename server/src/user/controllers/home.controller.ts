import ContactUsMail from "../../email/ContactUsMail";
import FrontendModel, {
  getFrontendInstance,
} from "../../models/frontend.model";
import { FrontendService } from "../../services/faq.service";
import { getAllColumns } from "../../services/frontend.service";
import { PlanService } from "../../services/plan.service";
import { sendResponse } from "../../utils/fns";
import sendMail from "../../utils/sendMail";
import { ContactUsSchemaType } from "../schemas/home.schema";

/**
 * get all columns of the frontend
 * @route /home/frontend
 * @public
 */
export const homeHandler = async () => {
  try {
    const columns = await getAllColumns();
    return columns;
  } catch (error) {
    throw error;
  }
};

export const getSocialLinksHandler = async () => {
  const frontend = await FrontendModel.findOne();
  return frontend?.socialLinks;
};

/**
 * get faqs
 * @route /home/faq
 * @public
 */
export const faqHandler = async () => {
  try {
    const faqs = await FrontendService.getAllFaq();
    return faqs;
  } catch (error) {
    throw error;
  }
};

/**
 * get plan
 * @route /home/faq
 * @public
 */
export const planHandler = async () => {
  try {
    const plan = await PlanService.getPlan();
    return plan;
  } catch (error) {
    throw error;
  }
};

/**
 * send contact mail
 */
export const sendContactMail = async ({
  input,
}: {
  input: ContactUsSchemaType;
}) => {
  const subject = "Contact Us";
  const document = ContactUsMail(input);

  const {
    contactUs: { email },
  } = await getFrontendInstance();
  await sendMail({ email, subject, document });
  return sendResponse("Thanks for contacting us. We will response soon.");
};
