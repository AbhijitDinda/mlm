import {
  getModelForClass
} from "@typegoose/typegoose";
import { ModelInsert } from "../utils/types";
import { UserPairIncomeModelSchema } from "./schemas/userPairIncome.schema";

class UserPairIncome extends UserPairIncomeModelSchema {}
export type UserPairIncomeInsert = ModelInsert<UserPairIncome>;

const UserPairIncomeModel = getModelForClass(UserPairIncome);
export default UserPairIncomeModel;
