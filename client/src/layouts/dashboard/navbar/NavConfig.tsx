import { Box } from "@mui/material";
import Iconify from "../../../components/Iconify";
import { APP_PATH } from "../../../routes/paths";

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
  products: getIcon("prime:file-pdf"),
  orders: getIcon("tabler:stack-2"),
  plan: getIcon("ion:diamond-outline"),
  network: getIcon("carbon:tree-view-alt"),
  myReferrals: getIcon("la:users"),
  totalTeam: getIcon("mdi:users-group-outline"),
  analytics: getIcon("tabler:brand-google-analytics"),
  transactions: getIcon("uil:transaction"),
  transferPayment: getIcon("mingcute:transfer-line"),
  withdraw: getIcon("uil:money-insert"),
  deposit: getIcon("uil:money-withdraw"),
  incomeHistory: getIcon("teenyicons:money-stack-outline"),
  profile: getIcon("mdi:user-outline"),
  addMember: getIcon("mdi:user-add-outline"),
  referralLink: getIcon("ph:link-bold"),
  support: getIcon("ic:twotone-support-agent"),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: "general",
    items: [
      { title: "dashboard", path: APP_PATH.dashboard, icon: ICONS.dashboard },
      { title: "plan", path: APP_PATH.plan, icon: ICONS.plan },
      { title: "e-Pin", path: APP_PATH.ePin, icon: ICONS.ePin },
      { title: "e-books", path: APP_PATH.product.root, icon: ICONS.products },
      { title: "orders", path: APP_PATH.order.root, icon: ICONS.orders },
      {
        title: "network",
        path: APP_PATH.network.root,
        icon: ICONS.network,
        children: [
          { title: "genealogy", path: APP_PATH.network.genealogy },
          { title: "tree", path: APP_PATH.network.tree },
        ],
      },
      {
        title: "my referrals",
        path: APP_PATH.myReferrals,
        icon: ICONS.myReferrals,
      },
      { title: "total team", path: APP_PATH.totalTeam, icon: ICONS.totalTeam },
      { title: "analytics", path: APP_PATH.analytics, icon: ICONS.analytics },
      {
        title: "transaction",
        path: APP_PATH.transaction.root,
        icon: ICONS.transactions,
      },
      {
        title: "transfer payment",
        path: APP_PATH.transferPayment,
        icon: ICONS.transferPayment,
      },
      {
        title: "withdraw system",
        path: APP_PATH.withdrawSystem.root,
        icon: ICONS.withdraw,
        children: [
          { title: "withdraw payment", path: APP_PATH.withdrawSystem.withdraw },
          { title: "withdraw history", path: APP_PATH.withdrawSystem.history },
          { title: "withdraw methods", path: APP_PATH.withdrawSystem.methods },
        ],
      },
      {
        title: "deposit system",
        path: APP_PATH.depositSystem.root,
        icon: ICONS.deposit,
        children: [
          { title: "deposit payment", path: APP_PATH.depositSystem.deposit },
          { title: "deposit history", path: APP_PATH.depositSystem.history },
        ],
      },
      {
        title: "income history",
        path: APP_PATH.incomeHistory.root,
        icon: ICONS.incomeHistory,
        children: [
          {
            title: "referral income",
            path: APP_PATH.incomeHistory.referralIncome,
          },
          { title: "pair income", path: APP_PATH.incomeHistory.pairIncome },
          {
            title: "indirect reward",
            path: APP_PATH.incomeHistory.indirectReward,
          },
        ],
      },
      { title: "profile", path: APP_PATH.profile, icon: ICONS.profile },
      {
        title: "add_member",
        path: APP_PATH.addMember,
        icon: ICONS.addMember,
        target: "_blank",
      },
      {
        title: "referral link",
        path: APP_PATH.referralLink,
        icon: ICONS.referralLink,
      },
      { title: "support", path: APP_PATH.support.root, icon: ICONS.support },
    ],
  },
];

export default navConfig;
