import { object, string, TypeOf } from "zod";

export const noticeUpdateSchema = object({
  notice: string({ required_error: "Notice is required" }),
});

export type NoticeUpdateSchemaType = TypeOf<typeof noticeUpdateSchema>;
