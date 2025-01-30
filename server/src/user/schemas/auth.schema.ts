import { boolean, number, object, string, TypeOf, z } from "zod";
import { PlacementSideArr } from "../../models/schemas/userTree.schema";

export const createUserSchema = object({
  email: string({ required_error: "Email is required" })
    .email("Please enter a valid email address")
    .max(100, "Email must be at most 100 characters"),
  userName: string({ required_error: "User name is required" })
    .min(2, "User name must be at least 4 characters")
    .max(20, "User name must be at most 20 characters"),
  firstName: string({ required_error: "First name is required" }).max(
    20,
    "First name must be at most 20 characters"
  ),
  lastName: string({ required_error: "Last name is required" }).max(
    20,
    "Last name must be at most 20 characters"
  ),
  password: string({ required_error: "Password is required" })
    .min(4, "Password must be at least 4 characters")
    .max(20, "Password must be at most 20 characters"),
  confirmPassword: string({ required_error: "Confirm Password is required" })
    .min(4, "Confirm Password must be at least 4 characters")
    .max(20, "Confirm Password must be at most 20 characters"),
  mobileNumber: string({ required_error: "Mobile number is required" }),
  ePin: string({ required_error: "E-pin is required" }),
  referralId: string({ required_error: "Referral Id is required" }).transform(
    Number
  ),
  placementId: string().transform(Number).optional(),
  placementSide: z.enum(PlacementSideArr),
  step: number().int().min(1).max(2),
  verificationCode: string({
    required_error: "Verification Code is required",
  })
    .length(6, { message: "Verification Code must be 6 characters" })
    .transform(Number)
    .optional(),
  referralUsername: string(),
  placementUsername: string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords are not matching",
});

export const loginUserSchema = object({
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

export const newUserSchema = object({
  userId: string({ required_error: "User id is required" }).transform(Number),
});

export const resetPasswordSchema = object({
  userId: string({ required_error: "User id is required" }),
  otp: string({
    required_error: "Verification Code is required",
  }).length(6),
  password: string({ required_error: "Password is required" })
    .min(4, "Password must be at least 4 characters")
    .max(20, "Password must be at most 20 characters"),
  confirmPassword: string({ required_error: "Confirm Password is required" })
    .min(4, "Confirm Password must be at least 4 characters")
    .max(20, "Confirm Password must be at most 20 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords are not matching",
});

export type CreateUserSchemaType = TypeOf<typeof createUserSchema>;
export type LoginUserSchemaType = TypeOf<typeof loginUserSchema>;
export type NewUserSchemaType = TypeOf<typeof newUserSchema>;
export type ResetPasswordSchemaType = TypeOf<typeof resetPasswordSchema>;
