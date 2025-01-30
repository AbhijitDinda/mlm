import { ClientSession } from "mongoose";
import SettingModel, {
  getSettingInstance,
  SettingInsert,
} from "../models/setting.model";
import { ModelSelect } from "../utils/types";
import { ClientError } from "../middleware/errors";

/**
 * create setting document
 */
export const createSetting = async (
  input: SettingInsert,
  session: ClientSession
) => {
  const setting = new SettingModel(input);
  await setting.save({ session });
  return setting;
};

/**
 * get setting configuration
 */

type SettingConfiguration = Pick<
  SettingInsert,
  | "currency"
  | "currencyPosition"
  | "appName"
  | "logo"
  | "favicon"
  | "country"
  | "fullLogo"
  | "siteConfiguration"
>;

export const getSettingConfiguration =
  async (): Promise<SettingConfiguration | null> => {
    const toSelect: ModelSelect<SettingInsert> = {
      currency: 1,
      currencyPosition: 1,
      appName: 1,
      fullLogo: 1,
      logo: 1,
      favicon: 1,
      country: 1,
      siteConfiguration: 1,
    };

    const row = await SettingModel.findOne().select(toSelect);
    return row;
  };

export const checkRegistrationPermission = async () => {
  const setting = await getSettingInstance();
  const { registration } = setting.siteConfiguration;
  if (!registration)
    throw ClientError("Currently, Registration is unavailable.");
};

export const getTimeZone = async () => {
  const row = await SettingModel.findOne();
  if (!row) return "Asia/Kolkata";
  return row.timezone;
};
