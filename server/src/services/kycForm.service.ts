import KycFormModel from "../models/kycForm.model";
import { toObjectId } from "../utils/fns";

export namespace KycFormService {
  export const isFormId = async (id: string) => {
    const _id = toObjectId(id);
    const row = await KycFormModel.findById(_id);
    return row !== null;
  };
}
