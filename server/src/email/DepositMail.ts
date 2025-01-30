import { Types } from "mongoose";
import { getUserInstance } from "../models/user.model";
import { getDepositInstance } from "../models/userDeposit.model";
import { fCurrency } from "../utils/fns";

const DepositMail = async (transactionId: Types.ObjectId) => {
  const deposit = await getDepositInstance(transactionId);
  const { userId, amount, charge, netAmount, gateway, type, status } = deposit;

  if (type === "auto") return;
  const amountText = await fCurrency(amount);
  const netAmountText = await fCurrency(netAmount);
  const chargeText = await fCurrency(charge);
  const { userName } = await getUserInstance(userId);
  const gatewayName = gateway.name;

  let titleEve: string;
  let title: string;
  if (status === "pending") {
    titleEve = "submitted";
    title = "Requested";
  } else if (status === "rejected") {
    titleEve = "rejected";
    title = "Rejected";
  } else if (status === "approved") {
    titleEve = "approved";
    title = "Approved";
  } else return;

  let html = `<p style="font-size:36px;line-height:42px;margin:30px 0;color:#1d1c1d;font-weight:700;padding:0">Deposit ${title}</p>
<p style="font-size:16px;line-height:24px;margin:16px 0;color:#333">Hello, ${userName}</p>
<p style="font-size:16px;line-height:24px;margin:16px 0;color:#333">Your deposit request of ${netAmountText} via ${gatewayName} has been
   ${titleEve} .</p>
<p style="font-size:16px;line-height:24px;margin:16px 0;color:#333"><b>Deposit details:</b></p>
<table
    style="width:100%;background:rgb(245, 244, 245);border-radius:4px;margin-right:50px;margin-bottom:30px;padding:43px 23px"
    align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
    <tbody>
    <tr style="display:grid;grid-auto-columns:minmax(0, 1fr);grid-auto-flow:column">
        <td>
    <tr>
        <td>
            <p style="font-size:18px;margin:16px 0;color:#637381">Amount</p>
        </td>
        <td>
            <p style="font-size:18px;margin:16px 0;color:#637381">
                ${amountText}
            </p>
        </td>
    </tr>
    </td>
    <td>
        <tr>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">
                   Charge
                </p>
            </td>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">
                    ${chargeText}
                </p>
            </td>
        </tr>
    </td>
    <td>
        <tr>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">
                Net Amount
                </p>
            </td>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">
                ${netAmountText}
                </p>
            </td>
        </tr>
    </td>
    <td>
        <tr>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">
                    Payment Method
                </p>
            </td>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">
                    ${gatewayName}
                </p>
            </td>
        </tr>
    </td>
    <td>
        <tr>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">Status</p>
            </td>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">${status}</p>
            </td>
        </tr>
    </td>
    </tr>
</tbody>
</table>`;

  if (status === "pending") {
    html += `
    <table style="width:100%" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
        <tbody>
            <tr style="display:grid;grid-auto-columns:minmax(0, 1fr);grid-auto-flow:column">
                <td>
                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#333">You&#x27;ll get a notification email
                        when deposit request will be verified.</p>
                </td>
            </tr>
        </tbody>
    </table>`;
  }

  return html;
};
export default DepositMail;
