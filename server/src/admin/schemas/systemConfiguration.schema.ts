import { array, boolean, number, object, string, TypeOf, z } from "zod";
import {
  fileExtensionsArr,
  inputTypeArr,
} from "../../models/schemas/kycForm.schema";

export const sendTestMailSchema = object({
  email: string({ required_error: "String is required" }),
});

export const updateEmailSettingSchema = object({
  encryption: z.enum(["ssl", "tls"] as const),
  host: string({ required_error: "Host is required" }),
  port: number({ required_error: "Port is required" }),
  userName: string({ required_error: "Username is required" }),
  password: string({ required_error: "Password is required" }),
});

export const updateEmailPreferencesSchema = object({
  paymentDeposit: boolean(),
  paymentTransfer: boolean(),
  paymentWithdraw: boolean(),
  registrationSuccess: boolean(),
});

export const updateSiteConfigurationSchema = object({
  contactDetails: boolean(),
  kycVerification: boolean(),
  registration: boolean(),
});

export const updateSiteSettingSchema = object({
  appName: string({ required_error: "App Name is required" }),
  currency: string({ required_error: "Currency is required" }),
  timezone: string({ required_error: "Timezone is required" }),
  currencyPosition: z.enum(["prefix", "suffix"] as const),
  balanceTransferCharge: number({
    required_error: "Balance Transfer charge is required",
  }),
  balanceTransferChargeType: z.enum(["fixed", "percent"] as const),
  emailAccountLimit: number({
    required_error: "Email Account Limit is required",
  }),
  country: string({ required_error: "Country is required" }),
});

export const createKycSettingSchema = object({
  _id: string().optional(),
  label: string({ required_error: "Label is required" }),
  required: z.enum(["required", "optional"]),
  inputType: z.enum(inputTypeArr),
  fileExtensions: array(z.enum(fileExtensionsArr)),
  dropdownOptions: array(
    object({ option: string({ required_error: "Option is required" }) })
  ),
});

export const updateFaqSectionSchema = object({
  title: string({ required_error: "Title is required" }),
  subtitle: string({ required_error: "Subtitle is required" }),
});

export const createFaqSchema = object({
  _id: string().optional(),
  question: string({ required_error: "Question is required" }),
  answer: string({ required_error: "Answer is required" }),
});

export type SendTestMailSchemaType = TypeOf<typeof sendTestMailSchema>;
export type UpdateEmailSettingSchemaType = TypeOf<
  typeof updateEmailSettingSchema
>;
export type UpdateEmailPreferencesSchemaType = TypeOf<
  typeof updateEmailPreferencesSchema
>;
export type UpdateSiteConfigurationSchemaType = TypeOf<
  typeof updateSiteConfigurationSchema
>;
export type UpdateSiteSettingSchemaType = TypeOf<
  typeof updateSiteSettingSchema
>;
export type CreateKycSettingSchemaType = TypeOf<typeof createKycSettingSchema>;
export type UpdateFaqSectionSchemaType = TypeOf<typeof updateFaqSectionSchema>;
export type CreateFaqSchemaType = TypeOf<typeof createFaqSchema>;
