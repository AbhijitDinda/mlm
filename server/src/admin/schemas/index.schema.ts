import { number, string, TypeOf } from "zod";

export const stringSchema = (text: string) =>
  string({ required_error: `${text} is required` });
export const numberSchema = (text: string) =>
  number({ required_error: `${text} is required` });
export const optionalStringSchema = string().optional();

export type NumberSchemaType = TypeOf<ReturnType<typeof numberSchema>>;
export type StringSchemaType = TypeOf<ReturnType<typeof stringSchema>>;
export type OptionalStringSchemaType = TypeOf<typeof optionalStringSchema>;
