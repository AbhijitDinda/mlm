import { adminProcedure, trpc } from "../../trpc";
import {
  faviconHandler,
  fullLogoHandler,
  getEmailPreferencesHandler,
  getEmailSettingHandler,
  getSiteConfigurationHandler,
  getSiteSettingHandler,
  kycCreateFormLabelHandler,
  kycDeleteFormLabelHandler,
  kycFormLabelListHandler,
  logoHandler,
  sendTestMailHandler,
  updateEmailPreferencesHandler,
  updateEmailSettingHandler,
  updateSiteConfigurationHandler,
  updateSiteSettingHandler,
} from "../controllers//systemConfiguration.controller";
import { stringSchema } from "../schemas/index.schema";
import {
  createKycSettingSchema,
  sendTestMailSchema,
  updateEmailPreferencesSchema,
  updateEmailSettingSchema,
  updateSiteConfigurationSchema,
  updateSiteSettingSchema,
} from "../schemas/systemConfiguration.schema";

const getEmailSetting = adminProcedure.query(() => getEmailSettingHandler());
const updateEmailSetting = adminProcedure
  .input(updateEmailSettingSchema)
  .mutation(({ input }) => updateEmailSettingHandler({ input }));

const getEmailPreferences = adminProcedure.query(() =>
  getEmailPreferencesHandler()
);
const updateEmailPreferences = adminProcedure
  .input(updateEmailPreferencesSchema)
  .mutation(({ input }) => updateEmailPreferencesHandler({ input }));

const getSiteSetting = adminProcedure.query(() => getSiteSettingHandler());
const updateSiteSetting = adminProcedure
  .input(updateSiteSettingSchema)
  .mutation(({ input }) => updateSiteSettingHandler({ input }));

const getSiteConfiguration = adminProcedure.query(() =>
  getSiteConfigurationHandler()
);
const updateSiteConfiguration = adminProcedure
  .input(updateSiteConfigurationSchema)
  .mutation(({ input }) => updateSiteConfigurationHandler({ input }));

const logo = adminProcedure
  .input(stringSchema("Logo"))
  .mutation(({ input }) => logoHandler({ input }));
const fullLogo = adminProcedure
  .input(stringSchema("Logo"))
  .mutation(({ input }) => fullLogoHandler({ input }));
const favicon = adminProcedure
  .input(stringSchema("Favicon"))
  .mutation(({ input }) => faviconHandler({ input }));

const sendTestMail = adminProcedure
  .input(sendTestMailSchema)
  .mutation(({ input }) => sendTestMailHandler({ input }));

/**
 * kyc setting
 */
const kycCreate = adminProcedure
  .input(createKycSettingSchema)
  .mutation(({ input }) => kycCreateFormLabelHandler({ input }));
const kycDelete = adminProcedure
  .input(stringSchema("Id"))
  .mutation(({ input }) => kycDeleteFormLabelHandler({ input }));
const kycList = adminProcedure.query(() => kycFormLabelListHandler());

const kycRouter = trpc.router({
  create: kycCreate,
  delete: kycDelete,
  list: kycList,
});

export const systemConfigurationRouter = trpc.router({
  getEmailSetting,
  updateEmailSetting,
  getEmailPreferences,
  updateEmailPreferences,
  getSiteSetting,
  updateSiteSetting,
  getSiteConfiguration,
  updateSiteConfiguration,
  sendTestMail,
  logo,
  fullLogo,
  favicon,
  kyc: kycRouter,
});
