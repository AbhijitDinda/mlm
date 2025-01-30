import { array, object, string, TypeOf } from "zod";

export const addTicketReplySchema = object({
  _id: string(),
  message: string({ required_error: "Message is required" }),
  files: array(string()),
});
export type AddTicketReplySchemaType = TypeOf<typeof addTicketReplySchema>;
