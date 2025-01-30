import { getModelForClass } from "@typegoose/typegoose";
import { ModelInsert } from "../utils/types";
import { UserReferralIncomeModelSchema } from "./schemas/userReferralIncome.schema";

class UserReferralIncome extends UserReferralIncomeModelSchema {}
export type UserReferralIncomeInsert = ModelInsert<UserReferralIncome>;

const UserReferralIncomeModel = getModelForClass(UserReferralIncome);
export default UserReferralIncomeModel;



