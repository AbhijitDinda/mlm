import { getModelForClass } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { HttpError } from "../middleware/errors";
import { toObjectId } from "../utils/fns";
import { ModelInsert } from "../utils/types";
import { UserKycModelSchema } from "./schemas/userKyc.schema";

class UserKyc extends UserKycModelSchema {}
export type UserKycInsert = ModelInsert<
  UserKyc,
  "status",
  "createdAt" | "updatedAt"
>;
export type UserKycRow = UserKycInsert & {
  _id: string | Types.ObjectId;
  createdAt: string;
  updatedAt: string;
};

const UserKycModel = getModelForClass(UserKyc);
export default UserKycModel;

export const getUserKycInstance = async (
  id: Types.ObjectId | string,
  options?: { populateUser?: boolean }
) => {
  const populateUser = options?.populateUser;

  const _id = toObjectId(id);
  const query = UserKycModel.findById(_id);
  if (populateUser) {
    query.populate("user");
  }
  const kyc = await query.exec();
  if (kyc === null)
    throw HttpError(`No User Kyc request found for id ${_id}`, "NOT_FOUND");

  return kyc;
};
