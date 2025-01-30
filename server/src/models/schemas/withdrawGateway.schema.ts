import { modelOptions, prop } from "@typegoose/typegoose";

export const chargeTypeArr = ["fixed", "percent"] as const;
export const inputTypeArr = [
  "input",
  "textarea",
  "date",
  "file",
  "dropdown",
] as const;
export const fileExtensionsArr = [
  "JPG",
  "JPEG",
  "PNG",
  "WEBP",
  "PDF",
  "DOC",
  "DOCX",
  "TXT",
  "XLX",
  "XLSX",
  "CSV",
] as const;
export const statusArr = ["active", "inactive"] as const;

export type ChargeType = typeof chargeTypeArr[number];
export type InputTypeType = typeof inputTypeArr[number];
export type FileExtensionsType = typeof fileExtensionsArr[number];
export type StatusType = typeof statusArr[number];

class DropdownOptions {
  @prop({ required: true })
  option: string;
}

export class Detail {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  label: string;

  @prop({
    required: true,
    enum: ["required", "optional"] as const,
    type: String,
  })
  required: "required" | "optional";

  @prop({
    required: true,
    enum: inputTypeArr,
    type: String,
  })
  inputType: InputTypeType;

  @prop({ type: () => [String] })
  fileExtensions: FileExtensionsType[];

  @prop({ type: () => [DropdownOptions] })
  dropdownOptions: DropdownOptions[];
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class WithdrawGatewayModelSchema {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  logo: string;

  @prop({ required: true })
  processingTime: string;

  @prop({ required: true, enum: statusArr, type: String })
  status: StatusType;

  @prop({ required: true })
  minWithdraw: number;

  @prop({ required: true })
  maxWithdraw: number;

  @prop({ required: true })
  charge: number;

  @prop({ required: true, enum: chargeTypeArr, type: String })
  chargeType: ChargeType;

  @prop({ required: true, type: () => [Detail] })
  details: Detail[];
}
