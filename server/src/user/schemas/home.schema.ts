import { TypeOf, object, string } from "zod";

export const contactUsSchema = object({
  firstName: string({ required_error: "First Name is required" }),
  lastName: string({ required_error: "Last Name is required" }),
  email: string({ required_error: "Email is required" }).email(),
  phone: string({ required_error: "Contact Number is required" }),
  message: string({ required_error: "Message is required" }),
});

export type ContactUsSchemaType = TypeOf<typeof contactUsSchema>;
