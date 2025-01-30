import { number, object, string, TypeOf } from "zod";

export const analyticSchema = object({
  startDate: string({ required_error: "Start Date is required" }),
  endDate: string({ required_error: "End Date is required" }),
  offset: number({ required_error: "Offset is required" }),
});

export type AnalyticSchemaType = TypeOf<typeof analyticSchema>;
