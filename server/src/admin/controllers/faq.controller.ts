import { ClientError } from "../../middleware/errors";
import FaqModel, { FaqRow } from "../../models/faq.model";
import { FrontendService } from "../../services/faq.service";
import { sendResponse } from "../../utils/fns";
import { StringSchemaType } from "../schemas/index.schema";
import { CreateFaqSchemaType } from "../schemas/systemConfiguration.schema";

export const getFaqListHandler = async (): Promise<FaqRow[]> => {
  const faqs = await FrontendService.getAllFaq();
  return faqs;
};

export const createFaqHandler = async ({
  input,
}: {
  input: CreateFaqSchemaType;
}) => {
  const { _id, question, answer } = input;

  let data: FaqRow;
  let message: string;

  if (_id) {
    const isId = await FrontendService.isFaqId(_id);
    if (!isId) throw ClientError(`No Faq with id ${_id}`);
    data = <FaqRow>await FaqModel.findByIdAndUpdate(
      _id,
      {
        $set: { question, answer },
      },
      { new: true }
    );
    message = "Faq has been updated";
  } else {
    data = await FaqModel.create({ question, answer });
    message = "Faq has been created";
  }
  return sendResponse(message, { data });
};

export const deleteFaqHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const _id = input;
  const isId = await FrontendService.isFaqId(_id);
  if (!isId) throw ClientError(`No Faq with id ${_id}`);
  await FaqModel.findByIdAndDelete(_id);
  return sendResponse("Faq has been deleted");
};
