import { coerce, number, object, string, TypeOf } from "zod";

export const generateEPinSchema = object({
  ePins: coerce
    .number({ required_error: "EPins count is required" })
    .min(1)
    .max(100, "Maximum 100 E-Pins can be generated at a time"),
  userId: number({ required_error: "User Id is required" }),
});

export type GenerateEPinSchemaType = TypeOf<typeof generateEPinSchema>;
