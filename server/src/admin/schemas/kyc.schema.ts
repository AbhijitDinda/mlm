import { object, string, TypeOf } from "zod";

export const rejectKycSchema = object({
  message: string({ required_error: "Message is required" }),
  id: string({ required_error: "Id is required" }),
});

export type RejectKycSchemaType = TypeOf<typeof rejectKycSchema>;
