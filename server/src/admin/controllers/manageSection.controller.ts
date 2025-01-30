import FrontendModel, { FrontendInsert } from "../../models/frontend.model";
import { sendResponse } from "../../utils/fns";
import { ModelSelect } from "../../utils/types";
import {
  UpdateAboutUsSchemaType,
  UpdateCommissionPolicySchemaType,
  UpdateContactUsSchemaType,
  UpdateHeroSectionType,
  UpdateOurMissionSchemaType,
  UpdateOurVisionSchemaType,
  UpdatePrivacyPolicySchemaType,
  UpdateRefundPolicySchemaType,
  UpdateSocialLinkSchemaType,
  UpdateTermsSchemaType,
} from "../schemas/manageSection.schema";
import { UpdateFaqSectionSchemaType } from "../schemas/systemConfiguration.schema";

export const getFaqHandler = async () => {
  const select: ModelSelect<FrontendInsert> = {
    faq: 1,
  };
  const data = await FrontendModel.findOne().select(select);
  return data?.faq;
};
export const updateFaqHandler = async ({
  input,
}: {
  input: UpdateFaqSectionSchemaType;
}) => {
  await FrontendModel.updateOne(undefined, { $set: { faq: input } });
  return sendResponse("Faq Section has been updated.");
};

/**
 * *about us
 */
export const getAboutUsHandler = async () => {
  const select: ModelSelect<FrontendInsert> = {
    aboutUs: 1,
  };
  const row = await FrontendModel.findOne().select(select);
  return row?.aboutUs;
};
export const updateAboutUsHandler = async ({
  input,
}: {
  input: UpdateAboutUsSchemaType;
}) => {
  await FrontendModel.updateOne(undefined, { $set: { aboutUs: input } });
  return sendResponse("About us has been updated");
};

export const getOurMissionHandler = async () => {
  const select: ModelSelect<FrontendInsert> = {
    ourMission: 1,
  };
  const row = await FrontendModel.findOne().select(select);
  return row?.ourMission;
};
export const updateOurMissionHandler = async ({
  input,
}: {
  input: UpdateOurMissionSchemaType;
}) => {
  await FrontendModel.updateOne(undefined, { $set: { ourMission: input } });
  return sendResponse("Our Mission has been updated");
};

export const getOurVisionHandler = async () => {
  const select: ModelSelect<FrontendInsert> = {
    ourVision: 1,
  };
  const row = await FrontendModel.findOne().select(select);
  return row?.ourVision;
};
export const updateOurVisionHandler = async ({
  input,
}: {
  input: UpdateOurVisionSchemaType;
}) => {
  await FrontendModel.updateOne(undefined, { $set: { ourVision: input } });
  return sendResponse("Our Vision has been updated");
};

export const getHeroSectionHandler = async () => {
  const select: ModelSelect<FrontendInsert> = {
    hero: 1,
  };
  const row = await FrontendModel.findOne().select(select);
  return row?.hero;
};
export const updateHeroSectionHandler = async ({
  input,
}: {
  input: UpdateHeroSectionType;
}) => {
  const data = input;
  await FrontendModel.updateOne(undefined, { $set: { hero: data } });
  return sendResponse("Hero section has been updated");
};

export const getPrivacyPolicyHandler = async () => {
  const select: ModelSelect<FrontendInsert> = {
    privacyPolicy: 1,
  };
  const data = await FrontendModel.findOne().select(select);
  return data?.privacyPolicy;
};
export const updatePrivacyPolicyHandler = async ({
  input,
}: {
  input: UpdatePrivacyPolicySchemaType;
}) => {
  await FrontendModel.updateOne(undefined, { $set: { privacyPolicy: input } });
  return sendResponse("Privacy Policy has been updated");
};

export const getTermsHandler = async () => {
  const select: ModelSelect<FrontendInsert> = {
    termsAndConditions: 1,
  };
  const data = await FrontendModel.findOne().select(select);
  return data?.termsAndConditions;
};
export const updateTermsHandler = async ({
  input,
}: {
  input: UpdateTermsSchemaType;
}) => {
  await FrontendModel.updateOne(undefined, {
    $set: { termsAndConditions: input },
  });
  return sendResponse("Terms And Conditions have been updated");
};

export const getRefundPolicyHandler = async () => {
  const select: ModelSelect<FrontendInsert> = {
    refundPolicy: 1,
  };
  const data = await FrontendModel.findOne().select(select);
  return data?.refundPolicy;
};
export const updateRefundPolicyHandler = async ({
  input,
}: {
  input: UpdateRefundPolicySchemaType;
}) => {
  await FrontendModel.updateOne(undefined, {
    $set: { refundPolicy: input },
  });
  return sendResponse("Refund Policy has been updated");
};

export const getCommissionPolicyHandler = async () => {
  const select: ModelSelect<FrontendInsert> = {
    commissionPolicy: 1,
  };
  const data = await FrontendModel.findOne().select(select);
  return data?.commissionPolicy;
};
export const updateCommissionPolicyHandler = async ({
  input,
}: {
  input: UpdateCommissionPolicySchemaType;
}) => {
  await FrontendModel.updateOne(undefined, {
    $set: { commissionPolicy: input },
  });
  return sendResponse("Commission Policy has been updated");
};

export const getContactUsHandler = async () => {
  const select: ModelSelect<FrontendInsert> = {
    contactUs: 1,
  };
  const data = await FrontendModel.findOne().select(select);
  return data?.contactUs;
};
export const updateContactUsHandler = async ({
  input,
}: {
  input: UpdateContactUsSchemaType;
}) => {
  await FrontendModel.updateOne(undefined, {
    $set: { contactUs: input },
  });
  return sendResponse("ContactUs has been updated");
};

export const getSocialLinkHandler = async () => {
  const select: ModelSelect<FrontendInsert> = {
    socialLinks: 1,
  };
  const data = await FrontendModel.findOne().select(select);
  return data?.socialLinks;
};
export const updateSocialLinkHandler = async ({
  input,
}: {
  input: UpdateSocialLinkSchemaType;
}) => {
  await FrontendModel.updateOne(undefined, {
    $set: { socialLinks: input },
  });
  return sendResponse("Social Link has been updated");
};
