import FaqModel, { FaqInsert, FaqRow } from "../models/faq.model";
import { toObjectId } from "../utils/fns";

export namespace FrontendService {
  export const getAllFaq = async (): Promise<FaqRow[]> => {
    const rows = await FaqModel.find();
    return rows;
  };
  export const isFaqId = async (id: string): Promise<boolean> => {
    const _id = toObjectId(id);
    const row = await FaqModel.findById(_id);
    return row != null;
  };
}
