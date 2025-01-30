// ----------------------------------------------------------------------

function path(root: string, subLink: string) {
  return `${root}${subLink}`;
}

const PATH_ROOT = "";

// ----------------------------------------------------------------------

export const APP_PATH = {
  home: PATH_ROOT,
  install: path(PATH_ROOT, "/install"),
  help: path(PATH_ROOT, "/help"),
  login: path(PATH_ROOT, "/login"),
  dashboard: path(PATH_ROOT, "/dashboard"),
  ePin: path(PATH_ROOT, "/e-pin"),
  plan: path(PATH_ROOT, "/plan"),
  genealogy: path(PATH_ROOT, "/genealogy"),
  users: {
    root: path(PATH_ROOT, "/users"),
    all: path(PATH_ROOT, "/users/all"),
    active: path(PATH_ROOT, "/users/active"),
    blocked: path(PATH_ROOT, "/users/blocked"),
    viewProfile: (userId: number | string) =>
      path(PATH_ROOT, `/users/profile/${userId}`),
  },
  kyc: {
    root: path(PATH_ROOT, "/kyc"),
    all: path(PATH_ROOT, "/kyc/all"),
    pending: path(PATH_ROOT, "/kyc/pending"),
    approved: path(PATH_ROOT, "/kyc/approved"),
    rejected: path(PATH_ROOT, "/kyc/rejected"),
    view: (id: string) => path(PATH_ROOT, `/kyc/view/${id}`),
  },
  support: {
    root: path(PATH_ROOT, "/support"),
    ticket: (id: string) => path(PATH_ROOT, `/support/ticket/${id}`),
  },
  withdraw: {
    root: path(PATH_ROOT, "/withdraw"),
    all: path(PATH_ROOT, "/withdraw/all"),
    pending: path(PATH_ROOT, "/withdraw/pending"),
    success: path(PATH_ROOT, "/withdraw/success"),
    rejected: path(PATH_ROOT, "/withdraw/rejected"),
    transaction: path(PATH_ROOT, "/withdraw/transaction"),
  },
  deposit: {
    root: path(PATH_ROOT, "/deposit"),
    all: path(PATH_ROOT, "/deposit/all"),
    pending: path(PATH_ROOT, "/deposit/pending"),
    approved: path(PATH_ROOT, "/deposit/approved"),
    rejected: path(PATH_ROOT, "/deposit/rejected"),
    automatic: path(PATH_ROOT, "/deposit/automatic"),
    transaction: path(PATH_ROOT, "/deposit/transaction"),
  },
  reports: {
    root: path(PATH_ROOT, "/reports"),
    joining: path(PATH_ROOT, "/reports/joining"),
    transactions: {
      root: path(PATH_ROOT, "/reports/transactions"),
      view: (id: string) => path(PATH_ROOT, `/reports/transactions/${id}`),
    },
    referralIncome: path(PATH_ROOT, "/reports/referral-income"),
    pairIncome: path(PATH_ROOT, "/reports/pair-income"),
    indirectReward: path(PATH_ROOT, "/reports/indirect-reward"),
    topSponsors: path(PATH_ROOT, "/reports/top-sponsors"),
    topEarners: path(PATH_ROOT, "/reports/top-earners"),
    analytics: path(PATH_ROOT, "/reports/analytics"),
  },
  reactivationLevel: path(PATH_ROOT, "/reactivation-level"),
  planSetting: {
    root: path(PATH_ROOT, "/plan-setting"),
    create: path(PATH_ROOT, "/plan-setting/create-plan"),
    update: (id: string) => path(PATH_ROOT, `/plan-setting/create-plan/${id}`),
  },
  paymentGateways: {
    root: path(PATH_ROOT, "/settings/payment-gateways"),
    withdraw: path(PATH_ROOT, "/settings/payment-gateways/withdraw"),
    createWithdrawGateway: path(
      PATH_ROOT,
      "/settings/payment-gateways/withdraw/create"
    ),
    updateWithdrawGateway: (id: string) =>
      path(PATH_ROOT, `/settings/payment-gateways/withdraw/create/${id}`),
    manualDeposit: path(PATH_ROOT, "/settings/payment-gateways/manual-deposit"),
    createManualDeposit: path(
      PATH_ROOT,
      "/settings/payment-gateways/manual-deposit/create"
    )
  },
  systemConfiguration: {
    root: path(PATH_ROOT, "/system-configuration"),
    emailSetting: path(PATH_ROOT, "/system-configuration/email-setting"),
    emailPreferences: path(
      PATH_ROOT,
      "/system-configuration/email-preferences"
    ),
    kyc: path(PATH_ROOT, "/system-configuration/kyc"),
    logo: path(PATH_ROOT, "/system-configuration/logo"),
    site: path(PATH_ROOT, "/system-configuration/site"),
  },
  manageSection: {
    root: path(PATH_ROOT, "/mange-section"),
    aboutUs: path(PATH_ROOT, "/mange-section/about-us"),
    contactUs: path(PATH_ROOT, "/mange-section/contact-us"),
    faq: path(PATH_ROOT, "/mange-section/faq"),
    hero: path(PATH_ROOT, "/mange-section/hero"),
    package: path(PATH_ROOT, "/mange-section/package"),
    privacy: path(PATH_ROOT, "/mange-section/privacy"),
    privacyPolicy: path(PATH_ROOT, "/mange-section/privacy-policy"),
    register: path(PATH_ROOT, "/mange-section/register"),
    termsAndConditions: path(PATH_ROOT, "/mange-section/terms-and-conditions"),
    refundPolicy: path(PATH_ROOT, "/mange-section/refund-policy"),
    commissionPolicy: path(PATH_ROOT, "/mange-section/commission-policy"),
    loginPage: path(PATH_ROOT, "/mange-section/login"),
  },
  extra: {
    changePassword: path(PATH_ROOT, "/change-password"),
  },
  productManagement: {
    category: {
      root: path(PATH_ROOT, "/product-management/category"),
      main: path(PATH_ROOT, "/product-management/category/main"),
      subCategory: path(PATH_ROOT, "/product-management/category/sub-category"),
      subSubCategory: path(
        PATH_ROOT,
        "/product-management/category/sub-sub-category"
      ),
    },
    product: {
      root: path(PATH_ROOT, "/product-management/product"),
      list: path(PATH_ROOT, "/product-management/products"),
      create: path(PATH_ROOT, "/product-management/products/create"),
      update: (id: string) =>
        path(PATH_ROOT, `/product-management/products/create/${id}`),
    },
    order: {
      list: path(PATH_ROOT, "/product-management/orders"),
      view: (id: string) =>
        path(PATH_ROOT, `/product-management/orders/${id}`),
    },
  },
};
export default APP_PATH;
export const PATH_DOCS = "/";
