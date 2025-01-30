import { boolean, number, object, record, string, TypeOf } from "zod";

export const contactDetailsSchema = object({
  address: string({ required_error: "Address is required" }),
  country: string({ required_error: "Country is required" }),
  state: string({ required_error: "State is required" }),
  city: string({ required_error: "City is required" }),
  pinCode: number({ required_error: "Pin Code is required" }),
  mobileNumber: string({ required_error: "Mobile Number is required" }),
});

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

export const twoFaSchema = object({
  step: number({ required_error: "Step is required" }),
  status: boolean({ required_error: "Status is required" }),
  verificationCode: string().transform(Number).optional(),
});

export const updateProfileSchema = object({
  firstName: string({ required_error: "First Name is required" }),
  lastName: string({ required_error: "Last Name is required" }),
  kyc: record(string(), string()),
});

export type ContactDetailsSchemaType = TypeOf<typeof contactDetailsSchema>;
export type ChangePasswordSchemaType = TypeOf<typeof changePasswordSchema>;
export type TwoFaSchemaType = TypeOf<typeof twoFaSchema>;
export type UpdateProfileSchemaType = TypeOf<typeof updateProfileSchema>;
