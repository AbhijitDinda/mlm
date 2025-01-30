// ----------------------------------------------------------------------

function path(root: string, subLink: string) {
  return `${root}${subLink}`;
}

const APP_PATH_ROOT = "";

// ----------------------------------------------------------------------

export const APP_PATH = {
  home: "/",
  plans: "/plans",
  aboutUs: "/about-us",
  contactUs: "/contact-us",
  faq: "/faq",
  termsAndCondition: "/terms-and-condition",
  privacyPolicy: "/privacy-policy",
  refundPolicy: "/refund-policy",
  commissionPolicy: "/commission-policy",
  login: path(APP_PATH_ROOT, "/login"),
  register: path(APP_PATH_ROOT, "/register"),
  registrationSuccess: (id: number) =>
    path(APP_PATH_ROOT, "/registration-success/" + id),
  resetPassword: path(APP_PATH_ROOT, "/reset-password"),
  dashboard: path(APP_PATH_ROOT, "/dashboard"),
  ePin: path(APP_PATH_ROOT, "/e-pin"),
  plan: path(APP_PATH_ROOT, "/plan"),
  network: {
    root: path(APP_PATH_ROOT, "/network"),
    genealogy: path(APP_PATH_ROOT, "/network/genealogy"),
    tree: path(APP_PATH_ROOT, "/network/tree"),
  },
  myReferrals: path(APP_PATH_ROOT, "/my-referrals"),
  totalTeam: path(APP_PATH_ROOT, "/total-team"),
  analytics: path(APP_PATH_ROOT, "/analytics"),
  transaction: {
    root: path(APP_PATH_ROOT, "/transaction"),
    view: (id: string) => path(APP_PATH_ROOT, `/transaction/${id}`),
  },
  transferPayment: path(APP_PATH_ROOT, "/transfer-payment"),
  withdrawSystem: {
    root: path(APP_PATH_ROOT, "/withdraw-system"),
    withdraw: path(APP_PATH_ROOT, "/withdraw-system/withdraw"),
    history: path(APP_PATH_ROOT, "/withdraw-system/history"),
    methods: path(APP_PATH_ROOT, "/withdraw-system/methods"),
    withdrawPayment: path(APP_PATH_ROOT, "/withdraw-system/withdraw-payment"),
    addMethod: path(APP_PATH_ROOT, "/withdraw-system/add-method"),
    transaction: path(APP_PATH_ROOT, "/withdraw-system/transaction"),
  },
  depositSystem: {
    root: path(APP_PATH_ROOT, "/deposit-system"),
    deposit: path(APP_PATH_ROOT, "/deposit-system/deposit"),
    instantDeposit: path(APP_PATH_ROOT, "/deposit-system/deposit/instant"),
    manualDeposit: path(APP_PATH_ROOT, "/deposit-system/deposit/manual"),
    cryptoCurrencyDeposit: path(
      APP_PATH_ROOT,
      "/deposit-system/deposit/crypto-currency"
    ),
    history: path(APP_PATH_ROOT, "/deposit-system/history"),
    transaction: path(APP_PATH_ROOT, "/deposit-system/transaction"),
  },
  incomeHistory: {
    root: path(APP_PATH_ROOT, "/income-history"),
    referralIncome: path(APP_PATH_ROOT, "/income-history/referral-income"),
    pairIncome: path(APP_PATH_ROOT, "/income-history/pair-income"),
    indirectReward: path(APP_PATH_ROOT, "/income-history/indirect-reward"),
  },
  profile: path(APP_PATH_ROOT, "/profile"),
  addMember: path(APP_PATH_ROOT, "/add-member"),
  referralLink: path(APP_PATH_ROOT, "/referral-link"),
  support: {
    root: path(APP_PATH_ROOT, "/support"),
    create: path(APP_PATH_ROOT, "/support/create-ticket"),
    ticket: (id: string) => path(APP_PATH_ROOT, `/support/ticket/${id}`),
  },
  product: {
    root: path(APP_PATH_ROOT, "/products"),
    view: (id: string) => path(APP_PATH_ROOT, `/products/${id}`),
  },
  order: {
    root: path(APP_PATH_ROOT, "/orders"),
  },
};

export default APP_PATH;
