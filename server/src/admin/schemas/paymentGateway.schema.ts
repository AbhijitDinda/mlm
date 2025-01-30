import { object, string, TypeOf, z } from "zod";

export const updateStatusSchema = object({
  id: string({ required_error: "Id is required" }),
  status: z.enum(["active", "inactive"]),
});

export type UpdateStatusSchemaType = TypeOf<typeof updateStatusSchema>;
