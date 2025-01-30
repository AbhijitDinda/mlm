import { Box } from "@mui/material";

import Iconify from "../../../components/Iconify";
import APP_PATH from "../../../routes/paths";

// ----------------------------------------------------------------------

function getIcon(src: string) {
  return (
    <Box
      component="span"
      sx={{
        width: 24,
        height: 24,
      }}
    >
      <Iconify icon={src} />
    </Box>
  );
}

const ICONS = {
  dashboard: getIcon("ri:dashboard-line"),
  ePin: getIcon("mdi:shield-key-outline"),
  genealogy: getIcon("carbon:tree-view-alt"),
  manageUsers: getIcon("mdi:users-group-outline"),
  kyc: getIcon("mdi:user-card-details-outline"),
  support: getIcon("ic:round-support-agent"),
  withdraw: getIcon("uil:money-insert"),
  deposit: getIcon("uil:money-withdraw"),
  incomeHistory: getIcon("fluent:money-20-regular"),
  reactivationLevel: getIcon("emojione-monotone:level-slider"),
  reports: {
    transactions: getIcon("mingcute:transfer-line"),
    joining: getIcon("ph:users"),
    topSponsors: getIcon("fa6-regular:chess-king"),
    topEarners: getIcon("game-icons:throne-king"),
    analytics: getIcon("tabler:brand-google-analytics"),
    referralIncome: getIcon("vaadin:money-exchange"),
  },
  planSettings: getIcon("tabler:diamond"),
  paymentGateways: getIcon("mdi:payment"),
  systemConfiguration: getIcon("uiw:setting-o"),
  manageSection: getIcon("icon-park-outline:file-settings"),
  changePassword: getIcon("material-symbols:password-rounded"),
  help: getIcon("material-symbols:help-outline-rounded"),
  productManagement: {
    categories: getIcon("akar-icons:sort"),
    product: getIcon("fluent-emoji-high-contrast:package"),
    order: getIcon("ph:stack-duotone"),
  },
};

const navConfig = ({ kyc }: { kyc: boolean }) => [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "home",
    items: [
      { title: "dashboard", path: APP_PATH.dashboard, icon: ICONS.dashboard },
      { title: "e-Pin", path: APP_PATH.ePin, icon: ICONS.ePin },
      { title: "genealogy", path: APP_PATH.genealogy, icon: ICONS.genealogy },
      {
        title: "manage users",
        path: APP_PATH.users.root,
        icon: ICONS.manageUsers,
        children: [
          { title: "all users", path: APP_PATH.users.all },
          { title: "active users", path: APP_PATH.users.active },
          { title: "blocked users", path: APP_PATH.users.blocked },
        ],
      },
      ...(kyc
        ? [
            {
              title: "kyc",
              path: APP_PATH.kyc.root,
              icon: ICONS.kyc,
              children: [
                { title: "pending kyc", path: APP_PATH.kyc.pending },
                { title: "approved kyc", path: APP_PATH.kyc.approved },
                { title: "rejected kyc", path: APP_PATH.kyc.rejected },
                { title: "all kyc", path: APP_PATH.kyc.all },
              ],
            },
          ]
        : []),
      {
        title: "support tickets",
        path: APP_PATH.support.root,
        icon: ICONS.support,
      },
      {
        title: "withdraw system",
        path: APP_PATH.withdraw.root,
        icon: ICONS.withdraw,
        children: [
          { title: "pending withdraw", path: APP_PATH.withdraw.pending },
          { title: "success withdraw", path: APP_PATH.withdraw.success },
          { title: "rejected withdraw", path: APP_PATH.withdraw.rejected },
          { title: "all withdraw", path: APP_PATH.withdraw.all },
        ],
      },
      {
        title: "deposit system",
        path: APP_PATH.deposit.root,
        icon: ICONS.deposit,
        children: [
          { title: "pending deposit", path: APP_PATH.deposit.pending },
          { title: "approved deposit", path: APP_PATH.deposit.approved },
          { title: "rejected deposit", path: APP_PATH.deposit.rejected },
          { title: "automatic deposit", path: APP_PATH.deposit.automatic },
          { title: "all deposit", path: APP_PATH.deposit.all },
        ],
      },
    ],
  },
  {
    subheader: "reports",
    items: [
      {
        title: "joining",
        path: APP_PATH.reports.joining,
        icon: ICONS.reports.joining,
      },
      {
        title: "transactions",
        path: APP_PATH.reports.transactions.root,
        icon: ICONS.reports.transactions,
      },
      {
        title: "referral income",
        path: APP_PATH.reports.referralIncome,
        icon: ICONS.reports.referralIncome,
      },
      {
        title: "pair income",
        path: APP_PATH.reports.pairIncome,
        icon: ICONS.reports.referralIncome,
      },
      {
        title: "indirect reward",
        path: APP_PATH.reports.indirectReward,
        icon: ICONS.reports.referralIncome,
      },
      {
        title: "top sponsors",
        path: APP_PATH.reports.topSponsors,
        icon: ICONS.reports.topSponsors,
      },
      {
        title: "top earners",
        path: APP_PATH.reports.topEarners,
        icon: ICONS.reports.topEarners,
      },
      {
        title: "analytics",
        path: APP_PATH.reports.analytics,
        icon: ICONS.reports.analytics,
      },
    ],
  },
  {
    subheader: "settings",
    items: [
      {
        title: "plan settings",
        path: APP_PATH.planSetting.root,
        icon: ICONS.planSettings,
      },
      {
        title: "reactivation level",
        path: APP_PATH.reactivationLevel,
        icon: ICONS.reactivationLevel,
      },
      {
        title: "payment gateways",
        path: APP_PATH.paymentGateways.root,
        icon: ICONS.paymentGateways,
        children: [
          { title: "withdraw", path: APP_PATH.paymentGateways.withdraw },
          {
            title: "manual deposit",
            path: APP_PATH.paymentGateways.manualDeposit,
          },
        ],
      },
      {
        title: "system configuration",
        path: APP_PATH.systemConfiguration.root,
        icon: ICONS.systemConfiguration,
        children: [
          {
            title: "email setting",
            path: APP_PATH.systemConfiguration.emailSetting,
          },
          {
            title: "email preferences",
            path: APP_PATH.systemConfiguration.emailPreferences,
          },
          { title: "kyc setting", path: APP_PATH.systemConfiguration.kyc },
          { title: "logo & favicon", path: APP_PATH.systemConfiguration.logo },
          { title: "site setting", path: APP_PATH.systemConfiguration.site },
        ],
      },
    ],
  },
  {
    subheader: "product management",
    items: [
      {
        title: "category setup",
        path: APP_PATH.productManagement.category.root,
        icon: ICONS.productManagement.categories,
        children: [
          {
            title: "Categories",
            path: APP_PATH.productManagement.category.main,
          },
          {
            title: "Sub Categories",
            path: APP_PATH.productManagement.category.subCategory,
          },
          {
            title: "Sub Sub Categories",
            path: APP_PATH.productManagement.category.subSubCategory,
          },
        ],
      },
      {
        title: "products",
        path: APP_PATH.productManagement.product.list,
        icon: ICONS.productManagement.product,
      },
      {
        title: "orders",
        path: APP_PATH.productManagement.order.list,
        icon: ICONS.productManagement.order,
      },
    ],
  },
  {
    subheader: "frontend manager",
    items: [
      {
        title: "manage section",
        path: APP_PATH.manageSection.root,
        icon: ICONS.manageSection,
        children: [
          { title: "hero", path: APP_PATH.manageSection.hero },
          { title: "about us", path: APP_PATH.manageSection.aboutUs },
          { title: "contact us", path: APP_PATH.manageSection.contactUs },
          { title: "faq", path: APP_PATH.manageSection.faq },
          {
            title: "terms & conditions",
            path: APP_PATH.manageSection.termsAndConditions,
          },
          {
            title: "privacy policy",
            path: APP_PATH.manageSection.privacyPolicy,
          },
          { title: "refund policy", path: APP_PATH.manageSection.refundPolicy },
          {
            title: "commission policy",
            path: APP_PATH.manageSection.commissionPolicy,
          },
        ],
      },
      {
        title: "Help",
        path: APP_PATH.help,
        icon: ICONS.help,
      },
    ],
  },
  {
    subheader: "extra",
    items: [
      {
        title: "change password",
        path: APP_PATH.extra.changePassword,
        icon: ICONS.changePassword,
      },
    ],
  },
];

export default navConfig;
