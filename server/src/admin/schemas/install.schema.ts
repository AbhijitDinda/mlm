import { object, string, TypeOf } from "zod";

export const installSchema = object({
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
    .min(4, "Password must be at least 4 characters")
    .max(20, "Password must be at most 20 characters"),
  mobileNumber: string({ required_error: "Mobile number is required" }),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords are not matching",
});

export type InstallSchemaType = TypeOf<typeof installSchema>;
