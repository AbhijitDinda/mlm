import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { _id: false } })
class AboutUs {
  @prop({ required: true })
  description: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class ContactUs {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  subtitle: string;

  @prop({ required: true })
  whatsapp: string;

  @prop({ required: true })
  email: string;

  @prop({ required: true })
  location: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class TermsAndConditions {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  description: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class Faq {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  subtitle: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class PrivacyPolicy {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  description: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class CommissionPolicy {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  description: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class RefundPolicy {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  description: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class SocialLinks {
  @prop()
  discord?: string;

  @prop()
  facebook?: string;

  @prop()
  instagram?: string;

  @prop()
  linkedin?: string;

  @prop()
  telegram?: string;

  @prop()
  twitter?: string;

  @prop()
  whatsapp?: string;

  @prop()
  youtube?: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class OurMission {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  image: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class OurVision {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  image: string;
}

@modelOptions({ schemaOptions: { _id: false } })
class Hero {
  @prop({ required: true })
  title: string;

  @prop({ required: true })
  description: string;

  @prop()
  image?: string;
}

export class FrontendModelSchema {
  @prop({ required: true })
  aboutUs: AboutUs;

  @prop({ required: true })
  contactUs: ContactUs;

  @prop({ required: true })
  termsAndConditions: TermsAndConditions;

  @prop({ required: true })
  faq: Faq;

  @prop({ required: true })
  privacyPolicy: PrivacyPolicy;

  @prop({ required: true })
  commissionPolicy: CommissionPolicy;

  @prop({ required: true })
  refundPolicy: RefundPolicy;

  @prop({ required: true })
  socialLinks: SocialLinks;

  @prop({ required: true })
  ourMission: OurMission;

  @prop({ required: true })
  ourVision: OurVision;

  @prop({ required: true })
  hero: Hero;
}
