import { startSession } from "mongoose";
import { HttpError } from "../../middleware/errors";
import { FrontendInsert } from "../../models/frontend.model";
import { SettingInsert } from "../../models/setting.model";
import { UserInsert } from "../../models/user.model";
import { UserTreeInsert } from "../../models/userTree.model";
import { createFrontend } from "../../services/frontend.service";
import { hasInstalled } from "../../services/install.service";
import {
  createSetting,
  getSettingConfiguration,
} from "../../services/setting.service";
import { UserServices } from "../../services/user.service";
import { DefaultFrontEnd } from "../../utils/defaultData";
import { sendResponse } from "../../utils/fns";
import { InstallSchemaType } from "../schemas/install.schema";

/**
 * setup basic structure
 * @public
 * @route /admin/install/setup
 */
export const installHandler = async (input: InstallSchemaType) => {
  const session = await startSession();
  session.startTransaction();

  try {
    // check if setup has completed
    const installed = await hasInstalled();
    if (installed) throw new Error("Setup has completed already.");

    //* create admin
    const { email, password, userName, firstName, lastName, mobileNumber } =
      input;
    const userId = await UserServices.generateUserId();
    const ePin = "root";

    //* create admin tree
    const leftCount = 0;
    const rightCount = 0;
    const level = 0;
    const referralId = 0;
    const placementId = 0;
    const lft = 1;
    const rgt = 2;
    const pairCount = 0;
    const userTreeDocument: UserTreeInsert = {
      userId,
      referralId,
      leftCount,
      level,
      rightCount,
      lft,
      rgt,
      pairCount,
      placementId,
      placementSide: "left",
    };
    const userTree = await UserServices.createUserTreeDocument(
      userTreeDocument,
      session
    );

    const userDocument: UserInsert = {
      email,
      userName,
      password,
      ePin,
      firstName,
      lastName,
      mobileNumber,
      userId,
      role: "admin",
      tree: userTree._id,
    };
    const user = await UserServices.createUserDocument(userDocument, session);

    //* create settings
    const appName = "Jamsrmlm";
    const balanceTransferCharge = 0;
    const emailAccountLimit = 0;
    const currency = "₹";
    const emailPreferences = {
      paymentDeposit: false,
      paymentTransfer: false,
      paymentWithdraw: false,
      registrationSuccess: true,
    };
    const siteConfiguration = {
      contactDetails: false,
      kycVerification: false,
      registration: true,
    };
    const fullLogo = "/public/images/full-logo.png";
    const logo = "/public/images/logo.png";
    const favicon = "/public/images/favicon.png";
    const notice = "Welcome to the Jamsrmlm";
    const settingDocument: SettingInsert = {
      appName,
      balanceTransferCharge,
      balanceTransferChargeType: "percent",
      currency,
      currencyPosition: "prefix",
      emailAccountLimit,
      emailPreferences,
      favicon,
      fullLogo,
      logo,
      notice,
      siteConfiguration,
      country: "IN",
      timezone:"Asia/Kolkata"
    };
    await createSetting(settingDocument, session);

    //* create frontend
    const frontendDocument: FrontendInsert = DefaultFrontEnd;
    await createFrontend(frontendDocument, session);

    // commit transaction
    await session.commitTransaction();
    return sendResponse("Installation successful");
  } catch (error) {
    // abort transaction
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

/**
 * get site configuration
 * @route /setting/configuration
 * @public
 */
export const getConfigurationHandler = async () => {
  try {
    const data = await getSettingConfiguration();
    if (data === null)
      throw HttpError("Installation required", "PRECONDITION_FAILED");
    return data;
  } catch (error) {
    throw error;
  }
};
