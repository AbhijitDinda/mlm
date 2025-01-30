import { getUserInstance } from "../models/user.model";
import { fCurrency } from "../utils/fns";

const TransferPaymentMail = async ({
  userId,
  agentId,
  netAmount,
  amount,
  status,
}: {
  userId: number;
  agentId: number;
  netAmount: number;
  amount: number;
  status: "transferred" | "received";
}) => {
  const { userName } = await getUserInstance(userId);
  const { userName: agentUserName } = await getUserInstance(agentId);
  const amountText = await fCurrency(amount);
  const netAmountText = await fCurrency(netAmount);

  let message: string;
  let title: string;

  if (status === "transferred") {
    message = `You have transferred ${netAmountText} to ${agentUserName} (${agentId})`;
    title = "Payment Transfer";
  } else {
    message = `You have received ${amountText} from ${agentUserName} (${agentId})`;
    title = "Payment Received";
  }

  return `<p style="font-size:36px;line-height:42px;margin:30px 0;color:#1d1c1d;font-weight:700;padding:0">${title}</p>
<p style="font-size:20px;line-height:28px;margin:16px 0;margin-bottom:30px">Hello ${userName}, ${message}</p>`;
};
export default TransferPaymentMail;
