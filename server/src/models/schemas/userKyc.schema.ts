import { modelOptions, prop, Ref } from "@typegoose/typegoose";

const KycStatusArr = ["pending", "approved", "rejected"] as const;
type KycStatus = typeof KycStatusArr[number];

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class UserKycModelSchema {
  @prop({ required: true })
  userId: number;

  @prop({
    required: true,
    enum: KycStatusArr,
    default: KycStatusArr[0],
    type: String,
  })
  status: KycStatus;

  @prop()
  message?: string;

  //todo
  @prop({ ref: "User" })
  user: Ref<"User">;

  createdAt: string;
  updatedAt: string;
}
