import { prop } from "@typegoose/typegoose";

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

type InputTypeType = typeof inputTypeArr[number];
type FileExtensionsType = typeof fileExtensionsArr[number];

class DropdownOptions {
  @prop({ required: true })
  option: string;
}

export class KycFormModelSchema {
  @prop({ required: true })
  label: string;

  @prop({ required: true, type: String, enum: inputTypeArr })
  inputType: InputTypeType;

  @prop({
    required: true,
    enum: ["required", "optional"] as const,
    type: String,
  })
  required: "required" | "optional";

  @prop({ type: () => [DropdownOptions] })
  dropdownOptions: DropdownOptions[];

  @prop({ type: () => [String] })
  fileExtensions: FileExtensionsType[];
}
