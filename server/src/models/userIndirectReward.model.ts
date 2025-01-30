import { getModelForClass } from "@typegoose/typegoose";
import { ModelInsert } from "../utils/types";
import { UserIndirectRewardModelSchema } from "./schemas/userIndirectReward.schema";

class UserIndirectReward extends UserIndirectRewardModelSchema {}
export type UserIndirectRewardInsert = ModelInsert<UserIndirectReward>;

const UserIndirectRewardModel = getModelForClass(UserIndirectReward);
export default UserIndirectRewardModel;
