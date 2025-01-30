import PaymentTransferModel, {
  PaymentTransferInsert,
} from "../../models/paymentTransfer.model";
import SettingModel from "../../models/setting.model";
import TicketModel, { TicketInsert } from "../../models/ticket.model";
import TransactionModel, {
  TransactionInsert,
} from "../../models/transaction.model";
import UserModel, { UserInsert } from "../../models/user.model";
import UserDepositModel, {
  UserDepositInsert,
  UserDepositRow,
} from "../../models/userDeposit.model";
import UserKycModel, { UserKycInsert } from "../../models/userKyc.model";
import UserTreeModel, { UserTreeInsert } from "../../models/userTree.model";
import UserWithdrawModel, {
  UserWithdrawInsert,
  UserWithdrawRow,
} from "../../models/userWithdraw.model";
import { DashboardService } from "../../services/dashboard.service";
import { sendResponse } from "../../utils/fns";
import { getEndOfDay, getStartOfDay } from "../../utils/time";
import { ModelFind, ModelMatch, _ModelColumn } from "../../utils/types";
import { NoticeUpdateSchemaType } from "../schemas/dashboard.schema";

interface IDashboard {
  leftJoining: number;
  rightJoining: number;
  activeUsers: number;
  blockedUsers: number;
  todayJoining: number;
  pendingDepositRequest: number;
  pendingDeposit: number;
  todayWithdraw: number;
  todayDeposit: number;
  pendingWithdraw: number;
  transactionsCharge: number;
  paymentTransfer: number;
  pendingWithdrawRequest: number;
  totalDeposit: number;
  totalWithdraw: number;
  pendingTickets: number;
  pendingKyc: number;
  activeTickets: number;
  closedTickets: number;
  totalTickets: number;
}

namespace Card {
  export const leftJoining = async () => {
    const find: ModelFind<UserTreeInsert> = {
      placementSide: "left",
    };
    const users = await UserTreeModel.countDocuments(find);
    return users;
  };

  export const rightJoining = async () => {
    const find: ModelFind<UserTreeInsert> = {
      placementSide: "right",
    };
    const users = await UserTreeModel.countDocuments(find);
    return users;
  };

  export const activeUsers = async () => {
    const find: ModelFind<UserInsert> = {
      status: "active",
    };
    const users = await UserModel.countDocuments(find);
    return users;
  };

  export const blockedUsers = async () => {
    const find: ModelFind<UserInsert> = {
      status: "blocked",
    };
    const users = await UserModel.countDocuments(find);
    return users;
  };

  export const todayJoining = async () => {
    const startDate = await getStartOfDay();
    const endDate = await getEndOfDay();
    const users = await UserModel.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate },
    });
    return users;
  };

  export const pendingDepositRequest = async () => {
    const find: ModelFind<UserDepositInsert> = {
      status: "review",
    };
    const users = await UserDepositModel.countDocuments(find);
    return users;
  };

  export const pendingDeposit = async () => {
    const sumColumn: _ModelColumn<UserDepositInsert> = "$netAmount";
    const match: ModelFind<UserDepositInsert> = {
      status: "review",
    };
    const sum = await UserDepositModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  };

  export const todayDeposit = async () => {
    const startDate = await getStartOfDay();
    const endDate = await getEndOfDay();
    const sumColumn: _ModelColumn<UserDepositInsert> = "$amount";
    const status: UserDepositRow["status"][] = ["approved", "credit"];
    const match: ModelMatch<UserDepositRow> = {
      status: { $in: status },
      updatedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    const sum = await UserDepositModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  };

  export const totalDeposit = async () => {
    const sumColumn: _ModelColumn<UserDepositInsert> = "$amount";
    const status: UserDepositRow["status"][] = ["approved", "credit"];
    const match: ModelMatch<UserDepositInsert> = {
      status: { $in: status },
    };
    const sum = await UserDepositModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  };

  export const totalWithdraw = async () => {
    const sumColumn: _ModelColumn<UserWithdrawInsert> = "$amount";
    const match: ModelFind<UserWithdrawInsert> = {
      status: "success",
    };
    const sum = await UserWithdrawModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  };

  export const pendingWithdrawRequest = async () => {
    const find: ModelFind<UserWithdrawInsert> = {
      status: "pending",
    };
    const users = await UserWithdrawModel.countDocuments(find);
    return users;
  };

  export const pendingWithdraw = async () => {
    const sumColumn: _ModelColumn<UserWithdrawInsert> = "$amount";
    const match: ModelFind<UserWithdrawInsert> = {
      status: "pending",
    };
    const sum = await UserWithdrawModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  };

  export const todayWithdraw = async () => {
    const startDate = await getStartOfDay();
    const endDate = await getEndOfDay();
    const sumColumn: _ModelColumn<UserWithdrawInsert> = "$amount";
    const match: ModelMatch<UserWithdrawRow> = {
      status: "success",
      updatedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    };
    const sum = await UserWithdrawModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  };

  export const transactionsCharge = async () => {
    const sumColumn: _ModelColumn<TransactionInsert> = "$charge";
    const status: TransactionInsert["status"][] = ["credit", "debit"];
    const match = {
      status: { $in: status },
    };
    const sum = await TransactionModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  };

  export const paymentTransfer = async () => {
    const sumColumn: _ModelColumn<PaymentTransferInsert> = "$charge";
    const match: ModelFind<PaymentTransferInsert> = {
      status: "transferred",
    };
    const sum = await PaymentTransferModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  };

  export const pendingTickets = async () => {
    const find: ModelFind<TicketInsert> = {
      status: "pending",
    };
    return await TicketModel.countDocuments(find);
  };

  export const pendingKyc = async () => {
    const find: ModelFind<UserKycInsert> = {
      status: "pending",
    };
    return await UserKycModel.countDocuments(find);
  };

  export const activeTickets = async () => {
    const find: ModelFind<TicketInsert> = {
      status: "active",
    };
    return await TicketModel.countDocuments(find);
  };

  export const closedTickets = async () => {
    const find: ModelFind<TicketInsert> = {
      status: "closed",
    };
    return await TicketModel.countDocuments(find);
  };

  export const totalTickets = async () => {
    return await TicketModel.countDocuments();
  };
}

export const getDashboardCardsHandler = async () => {
  const leftJoining = await Card.leftJoining();
  const rightJoining = await Card.rightJoining();
  const activeUsers = await Card.activeUsers();
  const blockedUsers = await Card.blockedUsers();
  const todayJoining = await Card.todayJoining();
  const pendingDepositRequest = await Card.pendingDepositRequest();
  const pendingDeposit = await Card.pendingDeposit();
  const todayWithdraw = await Card.todayWithdraw();
  const todayDeposit = await Card.todayDeposit();
  const pendingWithdraw = await Card.pendingWithdraw();
  const transactionsCharge = await Card.transactionsCharge();
  const paymentTransfer = await Card.paymentTransfer();
  const pendingWithdrawRequest = await Card.pendingWithdrawRequest();
  const totalDeposit = await Card.totalDeposit();
  const totalWithdraw = await Card.totalWithdraw();
  const pendingTickets = await Card.pendingTickets();
  const pendingKyc = await Card.pendingKyc();
  const activeTickets = await Card.activeTickets();
  const closedTickets = await Card.closedTickets();
  const totalTickets = await Card.totalTickets();

  const data: IDashboard = {
    leftJoining,
    rightJoining,
    activeUsers,
    blockedUsers,
    todayJoining,
    pendingDepositRequest,
    pendingDeposit,
    todayWithdraw,
    todayDeposit,
    pendingWithdraw,
    transactionsCharge,
    paymentTransfer,
    pendingWithdrawRequest,
    totalDeposit,
    totalWithdraw,
    pendingTickets,
    pendingKyc,
    activeTickets,
    closedTickets,
    totalTickets,
  };
  return data;
};

/**
 * get notice
 */
export const getNoticeHandler = async () => {
  const notice = await DashboardService.getNotice();
  return notice;
};

/**
 * update notice
 */
export const updateUpdateNoticeHandler = async ({
  input,
}: {
  input: NoticeUpdateSchemaType;
}) => {
  const { notice } = input;
  await SettingModel.updateOne(undefined, { notice });
  return sendResponse("Notice has been updated");
};
