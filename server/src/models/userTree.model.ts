import { getModelForClass } from "@typegoose/typegoose";
import { ClientSession } from "mongoose";
import { ModelInsert } from "../utils/types";
import { UserTreeModelSchema } from "./schemas/userTree.schema";

export class UserTree extends UserTreeModelSchema {}
export type UserTreeInsert = ModelInsert<UserTree>;

const UserTreeModel = getModelForClass(UserTree);
export default UserTreeModel;

/**
 * create user tree instance
 */
export const getUserTreeInstance = async (
  userId: number,
  session?: ClientSession
) => {
  const user = await UserTreeModel.findOne({ userId }).session(session ?? null);
  if (!user) throw new Error(`User tree for user ${userId} not found`);
  return user;
};
