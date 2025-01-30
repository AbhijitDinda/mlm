import { prop } from "@typegoose/typegoose";

export class FaqModelSchema {
  @prop({ required: true })
  question: string;

  @prop({ required: true })
  answer: string;
}
