import { array, number, object, string, TypeOf, z } from "zod";
import {
  fileExtensionsArr,
  inputTypeArr,
  statusArr,
} from "../../models/schemas/withdrawGateway.schema";

export const createWithdrawGatewaySchema = object({
  _id: string().optional(),
  logo: string({ required_error: "Logo is required" }),
  name: string({ required_error: "Name is required" }),
  processingTime: string({ required_error: "Processing Time is required" }),
  minWithdraw: number({ required_error: "Min Withdraw is required" }),
  maxWithdraw: number({ required_error: "Max Withdraw is required" }),
  charge: number({ required_error: "Charge is required" }),
  chargeType: z.enum(["fixed", "percent"]),
  status: z.enum(statusArr),
  details: array(
    object({
      name: string().optional(),
      label: string({ required_error: "Label is required" }),
      required: z.enum(["required", "optional"]),
      inputType: z.enum(inputTypeArr),
      fileExtensions: array(z.enum(fileExtensionsArr)),
      dropdownOptions: array(
        object({ option: string({ required_error: "Option is required" }) })
      ),
    })
  ).min(1, "Minimum 1 Detail is required"),
});

export const createManualDepositGatewaySchema = object({
  _id: string().optional(),
  logo: string({ required_error: "Logo is required" }),
  name: string({ required_error: "Name is required" }),
  processingTime: string({ required_error: "Processing Time is required" }),
  minDeposit: number({ required_error: "Min Withdraw is required" }),
  maxDeposit: number({ required_error: "Max Withdraw is required" }),
  charge: number({ required_error: "Charge is required" }),
  chargeType: z.enum(["fixed", "percent"]),
  status: z.enum(statusArr),
  details: array(
    object({
      label: string({ required_error: "Label is required" }),
      value: string({ required_error: "Label is required" }),
      type: z.enum(["input", "image"]),
    })
  ).min(1, "Minimum 1 Detail is required"),
});

export type CreateWithdrawGatewaySchemaType = TypeOf<
  typeof createWithdrawGatewaySchema
>;
export type CreateManualDepositGatewaySchemaType = TypeOf<
  typeof createManualDepositGatewaySchema
>;
