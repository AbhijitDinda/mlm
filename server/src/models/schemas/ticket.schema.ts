import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Roles, RolesArr, UserModelSchema } from "./user.schema";

const statusArr = ["pending", "active", "closed"] as const;
type Status = typeof statusArr[number];

@modelOptions({
  schemaOptions: {
    timestamps: {
      createdAt: true,
      updatedAt: false,
    },
    _id: false,
  },
})
class Messages {
  @prop({ required: true })
  userId: number;

  @prop({ required: true })
  message: string;

  @prop({ required: true, type: [String] })
  files: string[];
}

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class TicketModelSchema {
  @prop({ required: true })
  userId: number;

  @prop({ required: true })
  subject: string;

  @prop({ required: true, enum: statusArr, type: String })
  status: Status;

  @prop({ enum: RolesArr, type: String })
  closedBy?: Roles;

  @prop({ ref: () => UserModelSchema })
  user: Ref<UserModelSchema>;

  @prop({ type: () => [Messages] })
  messages: Messages[];

  createdAt: string;
  updatedAt: string;
}
