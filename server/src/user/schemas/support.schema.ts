import { array, boolean, object, string, TypeOf } from "zod";

export const createTicketSchema = object({
  _id: string().optional(),
  isReply: boolean({ required_error: "Is Reply is required" }),
  subject: string(),
  message: string({ required_error: "Message is required" }),
  files: array(string()),
});
export type CreateTicketSchemaType = TypeOf<typeof createTicketSchema>;
