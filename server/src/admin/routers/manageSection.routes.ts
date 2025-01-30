import { adminProcedure, trpc } from "../../trpc";
import {
  getAboutUsHandler,
  getCommissionPolicyHandler,
  getContactUsHandler,
  getFaqHandler, getHeroSectionHandler,
  getOurMissionHandler,
  getOurVisionHandler,
  getPrivacyPolicyHandler,
  getRefundPolicyHandler,
  getSocialLinkHandler,
  getTermsHandler,
  updateAboutUsHandler,
  updateCommissionPolicyHandler,
  updateContactUsHandler,
  updateFaqHandler,
  updateHeroSectionHandler,
  updateOurMissionHandler,
  updateOurVisionHandler,
  updatePrivacyPolicyHandler,
  updateRefundPolicyHandler,
  updateSocialLinkHandler,
  updateTermsHandler
} from "../controllers//manageSection.controller";
import {
  updateAboutUsSchema,
  updateCommissionPolicySchema,
  updateContactUsSchema,
  updateHeroSectionSchema,
  updateOurMissionSchema,
  updateOurVisionSchema,
  updatePrivacyPolicySchema,
  updateRefundPolicySchema,
  updateSocialLinkSchema,
  updateTermsSchema
} from "../schemas/manageSection.schema";
import {
  updateFaqSectionSchema
} from "../schemas/systemConfiguration.schema";

const getFaq = adminProcedure.query(() => getFaqHandler());
const updateFaq = adminProcedure
  .input(updateFaqSectionSchema)
  .mutation(({ input }) => updateFaqHandler({ input }));

const getAboutUs = adminProcedure.query(() => getAboutUsHandler());
const updateAboutUs = adminProcedure
  .input(updateAboutUsSchema)
  .mutation(({ input }) => updateAboutUsHandler({ input }));

const getOurMission = adminProcedure.query(() => getOurMissionHandler());
const updateOurMission = adminProcedure
  .input(updateOurMissionSchema)
  .mutation(({ input }) => updateOurMissionHandler({ input }));

const getOurVision = adminProcedure.query(() => getOurVisionHandler());
const updateOurVision = adminProcedure
  .input(updateOurVisionSchema)
  .mutation(({ input }) => updateOurVisionHandler({ input }));

const getHeroSection = adminProcedure.query(() => getHeroSectionHandler());
const updateHeroSection = adminProcedure
  .input(updateHeroSectionSchema)
  .mutation(({ input }) => updateHeroSectionHandler({ input }));

const getPrivacyPolicy = adminProcedure.query(() => getPrivacyPolicyHandler());
const updatePrivacyPolicy = adminProcedure
  .input(updatePrivacyPolicySchema)
  .mutation(({ input }) => updatePrivacyPolicyHandler({ input }));

const getTerms = adminProcedure.query(() => getTermsHandler());
const updateTerms = adminProcedure
  .input(updateTermsSchema)
  .mutation(({ input }) => updateTermsHandler({ input }));

const getRefundPolicy = adminProcedure.query(() => getRefundPolicyHandler());
const updateRefundPolicy = adminProcedure
  .input(updateRefundPolicySchema)
  .mutation(({ input }) => updateRefundPolicyHandler({ input }));

const getCommissionPolicy = adminProcedure.query(() =>
  getCommissionPolicyHandler()
);
const updateCommissionPolicy = adminProcedure
  .input(updateCommissionPolicySchema)
  .mutation(({ input }) => updateCommissionPolicyHandler({ input }));

const getContactUs = adminProcedure.query(() => getContactUsHandler());
const updateContactUs = adminProcedure
  .input(updateContactUsSchema)
  .mutation(({ input }) => updateContactUsHandler({ input }));

const getSocialLink = adminProcedure.query(() => getSocialLinkHandler());
const updateSocialLink = adminProcedure
  .input(updateSocialLinkSchema)
  .mutation(({ input }) => updateSocialLinkHandler({ input }));


export const manageSectionRouter = trpc.router({
  getFaq,
  updateFaq,
  getAboutUs,
  updateAboutUs,
  getOurMission,
  updateOurMission,
  getOurVision,
  updateOurVision,
  getHeroSection,
  updateHeroSection,
  getPrivacyPolicy,
  updatePrivacyPolicy,
  getTerms,
  updateTerms,
  getRefundPolicy,
  updateRefundPolicy,
  getCommissionPolicy,
  updateCommissionPolicy,
  getContactUs,
  updateContactUs,
  getSocialLink,
  updateSocialLink,
});
