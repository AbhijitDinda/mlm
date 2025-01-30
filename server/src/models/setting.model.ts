import { getModelForClass } from "@typegoose/typegoose";
import { API_URL } from "../config";
import { ClientError } from "../middleware/errors";
import { ModelInsert } from "../utils/types";
import { SettingModelSchema } from "./schemas/setting.schema";

class Setting extends SettingModelSchema {
  getAbsoluteLogoUrl() {
    API_URL + this.logo;
  }
  getCharge(amount: number) {
    const chargeType = this.balanceTransferChargeType;
    const charge = this.balanceTransferCharge;
    if (chargeType === "fixed") return charge;
    return (amount * charge) / 100;
  }
}

export type SettingInsert = ModelInsert<Setting>;

const SettingModel = getModelForClass(Setting);
export default SettingModel;

/**
 * create setting instance
 */
export const getSettingInstance = async () => {
  const setting = await SettingModel.findOne();
  if (!setting) return ClientError("Setting document not found");

  return setting;
};
