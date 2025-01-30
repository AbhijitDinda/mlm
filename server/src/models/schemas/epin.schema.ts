import { modelOptions, prop } from "@typegoose/typegoose";

const statusArr = ["active", "expired"] as const;
type Status = typeof statusArr[number];

@modelOptions({
  schemaOptions: { timestamps: { createdAt: true, updatedAt: false } },
})
export class EPinSchema {
  @prop({ required: true, index: true, unique: true, type: String })
  ePin: string;

  @prop({ required: true, enum: statusArr, type: String })
  status: Status;

  @prop()
  assignedTo?: number;

  @prop()
  registeredBy?: number;

  @prop()
  activatedAt?: Date;
}
