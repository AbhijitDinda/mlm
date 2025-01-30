import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class EPinTransferModelSchema {
  @prop({ required: true })
  userId: number;

  @prop({ required: true })
  ePins: number;
}
