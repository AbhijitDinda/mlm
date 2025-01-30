import { number, object, string, TypeOf } from "zod";

export const changePasswordSchema = object({
  oldPassword: string({ required_error: "Old Password is required" }),
  password: string({ required_error: "Password is required" })
    .min(4, "Password must be at least 4 characters")
    .max(20, "Password must be at most 20 characters"),
  confirmPassword: string({ required_error: "Confirm Password is required" })
    .min(4, "Confirm Password must be at least 4 characters")
    .max(20, "Confirm Password must be at most 20 characters"),
  step: number().int().min(1).max(2),
  verificationCode: string({
    required_error: "Verification Code is required",
  })
    .length(6, { message: "Verification Code must be 6 characters" })
    .transform(Number)
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Confirm Passwords are not matching",
});
export type ChangePasswordSchemaType = TypeOf<typeof changePasswordSchema>;
