import mongoose from "mongoose";
import { IS_DEMO } from "../../config";
import EmailTestingMail from "../../email/EmailTestingMail";
import { ClientError } from "../../middleware/errors";
import KycFormModel, {
  KycFormInsert,
  KycFormRow,
} from "../../models/kycForm.model";
import { EmailPreferences, Mail } from "../../models/schemas/setting.schema";
import SettingModel, { SettingInsert } from "../../models/setting.model";
import UserModel, { UserInsert } from "../../models/user.model";
import UserKycModel, { UserKycInsert } from "../../models/userKyc.model";
import { KycFormService } from "../../services/kycForm.service";
import { sendResponse } from "../../utils/fns";
import sendMail from "../../utils/sendMail";
import { ModelFind, ModelSelect } from "../../utils/types";
import { StringSchemaType } from "../schemas/index.schema";
import {
  CreateKycSettingSchemaType,
  SendTestMailSchemaType,
  UpdateEmailPreferencesSchemaType,
  UpdateEmailSettingSchemaType,
  UpdateSiteConfigurationSchemaType,
  UpdateSiteSettingSchemaType,
} from "../schemas/systemConfiguration.schema";

/**
 * get email setting
 */
export const getEmailSettingHandler = async (): Promise<Mail | undefined> => {
  const data = await SettingModel.findOne().select({ mail: 1 });
  const mail = data?.mail;
  if (IS_DEMO && mail) {
    mail.password = "*".repeat(8);
  }
  return mail;
};

/**
 * update email setting
 */
export const updateEmailSettingHandler = async ({
  input,
}: {
  input: UpdateEmailSettingSchemaType;
}) => {
  if (IS_DEMO) {
    throw ClientError("This feature is disabled in demo mode");
  }

  const mail: Mail = input;
  await SettingModel.updateOne(undefined, { $set: { mail } });
  return sendResponse("Email settings has been updated");
};

/**
 * send test email
 */
export const sendTestMailHandler = async ({
  input,
}: {
  input: SendTestMailSchemaType;
}) => {
  const { email } = input;
  const document = EmailTestingMail();
  const subject = "Email Testing";
  await sendMail({ email, subject, document });
  return sendResponse(`Test email has been sent to ${email}`);
};

/**
 * get email preferences
 */
export const getEmailPreferencesHandler = async () => {
  const select: ModelSelect<SettingInsert> = {
    emailPreferences: 1,
  };
  const data = await SettingModel.findOne().select(select);
  return data?.emailPreferences;
};

/**
 * updated email preferences
 */
export const updateEmailPreferencesHandler = async ({
  input,
}: {
  input: UpdateEmailPreferencesSchemaType;
}) => {
  const data: EmailPreferences = input;
  await SettingModel.updateOne(undefined, { $set: { emailPreferences: data } });
  return sendResponse("Email preferences has been updated");
};

/**
 * get site setting
 */
export const getSiteSettingHandler = async () => {
  const select: ModelSelect<SettingInsert> = {
    appName: 1,
    currency: 1,
    currencyPosition: 1,
    balanceTransferCharge: 1,
    balanceTransferChargeType: 1,
    emailAccountLimit: 1,
    country: 1,
    timezone: 1,
  };

  const data = await SettingModel.findOne().select(select);
  return data;
};

/**
 * update site setting
 */
export const updateSiteSettingHandler = async ({
  input,
}: {
  input: UpdateSiteSettingSchemaType;
}) => {
  await SettingModel.updateOne(undefined, { $set: input });
  return sendResponse("Setting has been updated");
};

/**
 * get site configuration
 */
export const getSiteConfigurationHandler = async () => {
  const select: ModelSelect<SettingInsert> = {
    siteConfiguration: 1,
  };
  const data = await SettingModel.findOne().select(select);
  return data?.siteConfiguration;
};

/**
 * update site configuration
 */
export const updateSiteConfigurationHandler = async ({
  input,
}: {
  input: UpdateSiteConfigurationSchemaType;
}) => {
  await SettingModel.updateOne(undefined, {
    $set: { siteConfiguration: input },
  });
  return sendResponse("Site configuration has been updated");
};

/**
 * update full logo
 */
export const fullLogoHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  await SettingModel.updateOne(undefined, { $set: { fullLogo: input } });
  return sendResponse("Full Logo has been updated");
};
/**
 * update logo
 */
export const logoHandler = async ({ input }: { input: StringSchemaType }) => {
  await SettingModel.updateOne(undefined, { $set: { logo: input } });
  return sendResponse("Logo has been updated");
};

/**
 * update favicon
 */
export const faviconHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  await SettingModel.updateOne(undefined, { $set: { favicon: input } });
  return sendResponse("Favicon has been updated");
};

/**
 * *kyc
 */

export const kycCreateFormLabelHandler = async ({
  input,
}: {
  input: CreateKycSettingSchemaType;
}) => {
  const {
    _id,
    label,
    inputType,
    required,
    dropdownOptions: dropdownOptionsMain,
    fileExtensions,
  } = input;

  let dropdownOptions: {
    option: string;
  }[];
  if (inputType !== "dropdown") {
    dropdownOptions = [];
  } else {
    dropdownOptions = dropdownOptionsMain;
  }

  const doc: KycFormInsert = {
    label,
    inputType,
    required,
    dropdownOptions,
    fileExtensions,
  };
  let data: KycFormRow;
  let message: string;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (required === "required") {
      // set user kyc to unverified
      const remove: ModelFind<UserKycInsert> = {
        status: "pending",
      };
      const set: ModelFind<UserInsert> = {
        kyc: "unverified",
      };
      await UserModel.updateMany(undefined, { $set: set }).session(session);

      // remove pending kyc
      await UserKycModel.deleteMany(remove).session(session);
    }

    if (_id) {
      const isId = await KycFormService.isFormId(_id);
      if (!isId) throw ClientError(`No Kyc Form with id ${_id}`);

      data = <KycFormRow>(
        await KycFormModel.findByIdAndUpdate(
          _id,
          { $set: doc },
          { new: true }
        ).session(session)
      );
      message = "Kyc Form has been updated";
    } else {
      const form = new KycFormModel(doc);
      await form.save({ session });
      data = form;
      message = "Kyc Form has been created";
    }

    await session.commitTransaction();
    return sendResponse(message, { data });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const kycDeleteFormLabelHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const id = input;
  await KycFormModel.findByIdAndDelete(id);
  return sendResponse("Kyc Label has been deleted");
};

export const kycFormLabelListHandler = async (): Promise<KycFormRow[]> => {
  const lists = await KycFormModel.find();
  return lists;
};
