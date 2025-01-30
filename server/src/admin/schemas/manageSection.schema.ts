import { object, string, TypeOf } from "zod";

export const updateHeroSectionSchema = object({
  title: string({ required_error: "Title is required" }),
  description: string({ required_error: "Description is required" }),
  image: string({ required_error: "Image is required" }),
});

export const updateAboutUsSchema = object({
  description: string({ required_error: "Description is required" }),
});

export const updateOurMissionSchema = object({
  title: string({ required_error: "Title is required" }),
  description: string({ required_error: "Description is required" }),
  image: string({ required_error: "Image is required" }),
});

export const updateOurVisionSchema = object({
  title: string({ required_error: "Title is required" }),
  description: string({ required_error: "Description is required" }),
  image: string({ required_error: "Image is required" }),
});

export const updateContactUsSchema = object({
  title: string({ required_error: "Title is required" }),
  subtitle: string({ required_error: "Subtitle is required" }),
  whatsapp: string({ required_error: "Whatsapp is required" }),
  email: string({ required_error: "Email is required" }),
  location: string({ required_error: "Location is required" }),
});

export const updateSocialLinkSchema = object({
  youtube: string().optional(),
  facebook: string().optional(),
  instagram: string().optional(),
  twitter: string().optional(),
  linkedin: string().optional(),
  telegram: string().optional(),
  discord: string().optional(),
});

export const updateTermsSchema = object({
  title: string({ required_error: "Title is required" }),
  description: string({ required_error: "Description is required" }),
});

export const updatePrivacyPolicySchema = object({
  title: string({ required_error: "Title is required" }),
  description: string({ required_error: "Description is required" }),
});

export const updateRefundPolicySchema = object({
  title: string({ required_error: "Title is required" }),
  description: string({ required_error: "Description is required" }),
});

export const updateCommissionPolicySchema = object({
  title: string({ required_error: "Title is required" }),
  description: string({ required_error: "Description is required" }),
});

export type UpdateAboutUsSchemaType = TypeOf<typeof updateAboutUsSchema>;
export type UpdateHeroSectionType = TypeOf<typeof updateHeroSectionSchema>;
export type UpdateOurMissionSchemaType = TypeOf<typeof updateOurMissionSchema>;
export type UpdateOurVisionSchemaType = TypeOf<typeof updateOurVisionSchema>;
export type UpdateContactUsSchemaType = TypeOf<typeof updateContactUsSchema>;
export type UpdateSocialLinkSchemaType = TypeOf<typeof updateSocialLinkSchema>;
export type UpdateTermsSchemaType = TypeOf<typeof updateTermsSchema>;
export type UpdatePrivacyPolicySchemaType = TypeOf<
  typeof updatePrivacyPolicySchema
>;
export type UpdateRefundPolicySchemaType = TypeOf<
  typeof updateRefundPolicySchema
>;
export type UpdateCommissionPolicySchemaType = TypeOf<
  typeof updateCommissionPolicySchema
>;
