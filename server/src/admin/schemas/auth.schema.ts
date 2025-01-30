import { boolean, number, object, string, TypeOf } from "zod";

export const loginAdminSchema = object({
  userId: string({ required_error: "User id is required" }),
  password: string({ required_error: "Password is required" }),
  remember: boolean({ required_error: "Remember me is required" }),
  step: number({ required_error: "Step is required" }),
  verificationCode: string({
    required_error: "Verification Code is required",
  })
    .length(6)
    .optional(),
});

export type LoginAdminSchemaType = TypeOf<typeof loginAdminSchema>;
