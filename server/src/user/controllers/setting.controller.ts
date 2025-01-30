import { getSettingConfiguration } from "../../services/setting.service";

/**
 * get site configuration
 * @route /setting/configuration
 * @public
 */
export const getConfigurationHandler = async () => {
  try {
    const data = await getSettingConfiguration();
    return data;
  } catch (error) {
    throw error;
  }
};
