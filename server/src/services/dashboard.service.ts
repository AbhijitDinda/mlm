import SettingModel, { SettingInsert } from "../models/setting.model";
import { ModelSelect } from "../utils/types";

export namespace DashboardService {
  /**
   * get notice
   */
  export const getNotice = async () => {
    const select: ModelSelect<SettingInsert> = {
      notice: 1,
    };
    const rows = await SettingModel.find().select(select);
    const row = rows[0];
    return row.notice;
  };
}
