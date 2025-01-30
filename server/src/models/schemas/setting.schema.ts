import { modelOptions, prop } from "@typegoose/typegoose";

const encryptionArr = ["ssl", "tls"] as const;
const chargeTypeArr = ["fixed", "percent"] as const;
const currencyPositionArr = ["prefix", "suffix"] as const;

type Encryption = typeof encryptionArr[number];
type ChargeType = typeof chargeTypeArr[number];
type CurrencyPosition = typeof currencyPositionArr[number];

@modelOptions({ schemaOptions: { _id: false } })
export class EmailPreferences {
  @prop()
  paymentDeposit: boolean;

  @prop()
  paymentTransfer: boolean;

  @prop()
  paymentWithdraw: boolean;

  @prop()
  registrationSuccess: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
export class SiteConfiguration {
  @prop()
  contactDetails: boolean;

  @prop()
  kycVerification: boolean;

  @prop()
  registration: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
export class Mail {
  @prop({ required: true, enum: encryptionArr, type: String })
  encryption: Encryption;

  @prop({ required: true })
  host: string;

  @prop({ required: true })
  userName: string;

  @prop({ required: true })
  port: number;

  @prop({ required: true })
  password: string;
}

export class SettingModelSchema {
  @prop()
  mail?: Mail;

  @prop({ required: true })
  logo: string;

  @prop({ required: true })
  fullLogo: string;

  @prop({ required: true })
  favicon: string;

  @prop({ required: true })
  appName: string;

  @prop({ required: true })
  currency: string;

  @prop({ required: true })
  country: string;

  @prop({ required: true })
  timezone: string;

  @prop({ required: true, enum: currencyPositionArr, type: String })
  currencyPosition: CurrencyPosition;

  @prop()
  notice?: string;

  @prop({ required: true })
  balanceTransferCharge: number;

  @prop({ required: true, enum: chargeTypeArr, type: String })
  balanceTransferChargeType: ChargeType;

  @prop({ required: true })
  emailAccountLimit: number;

  @prop({ required: true })
  emailPreferences: EmailPreferences;

  @prop({ required: true })
  siteConfiguration: SiteConfiguration;
}
