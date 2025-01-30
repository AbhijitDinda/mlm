import { DocumentType, getModelForClass } from "@typegoose/typegoose";
import bcrypt from "bcryptjs";
import { ClientSession } from "mongoose";
import { ClientError } from "../middleware/errors";
import { PlanService } from "../services/plan.service";
import { createTransactionDocument } from "../services/transaction.service";
import { UserServices } from "../services/user.service";
import { getEndOfDay, getStartOfDay } from "../utils/time";
import { ModelFind, ModelInsert, _ModelColumn } from "../utils/types";
import KycFormModel from "./kycForm.model";
import OrderModel, { OrderInsert } from "./order.model";
import PaymentTransferModel, {
  PaymentTransferInsert,
} from "./paymentTransfer.model";
import { getPlanInstance } from "./plan.model";
import { UserModelSchema } from "./schemas/user.schema";
import { PlacementSide } from "./schemas/userTree.schema";
import { getSettingInstance } from "./setting.model";
import TransactionModel, { TransactionInsert } from "./transaction.model";
import UserDepositModel, { UserDepositInsert } from "./userDeposit.model";
import UserIndirectRewardModel, {
  UserIndirectRewardInsert,
} from "./userIndirectReward.model";
import UserPairIncomeModel, {
  UserPairIncomeInsert,
} from "./userPairIncome.model";
import UserReferralIncomeModel, {
  UserReferralIncomeInsert,
} from "./userReferralIncome.model";
import UserTreeModel, {
  UserTreeInsert,
  getUserTreeInstance,
} from "./userTree.model";
import UserWithdrawModel, { UserWithdrawInsert } from "./userWithdraw.model";

class UserDashboard extends UserModelSchema {
  /**
   * get amount in user wallet
   */
  async wallet(
    this: DocumentType<User>,
    session?: ClientSession
  ): Promise<number> {
    // credits
    const referralIncome = await this.referralIncome(session);
    const receivedAmount = await this.receivedAmount(session);
    const deposit = await this.deposit(session);
    const pairIncome = await this.pairIncome(session);
    const indirectReward = await this.indirectReward(session);

    // debits
    const withdraw = await this.withdraw();
    const pendingWithdraw = await this.pendingWithdraw();
    const transferredAmount = await this.transferredAmount();
    const reactivationDebit = await this.reactivationDebit();
    const eBookDebit = await this.eBookDebit();

    const totalCredits =
      deposit + referralIncome + pairIncome + receivedAmount + indirectReward;

    const totalDebits =
      withdraw +
      pendingWithdraw +
      transferredAmount +
      reactivationDebit +
      eBookDebit;

    const totalWallet = totalCredits - totalDebits;
    const finalWallet = Number(totalWallet.toFixed(2));
    return finalWallet;
  }

  /**
   * sum of the reactivation debit
   */
  async reactivationDebit(this: DocumentType<User>): Promise<number> {
    const sumColumn: _ModelColumn<TransactionInsert> = "$netAmount";
    const match: ModelFind<TransactionInsert> = {
      userId: this.userId,
      status: "debit",
      category: "reactivation",
    };
    const sum = await TransactionModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  }

  async eBookDebit(this: DocumentType<User>): Promise<number> {
    const sumColumn: _ModelColumn<OrderInsert> = "$purchasePrice";
    const match: ModelFind<OrderInsert> = {
      userId: this.userId,
    };
    const sum = await OrderModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  }

  async receivedAmount(
    this: DocumentType<User>,
    session?: ClientSession
  ): Promise<number> {
    const sumColumn: _ModelColumn<PaymentTransferInsert> = "$netAmount";
    const match: ModelFind<PaymentTransferInsert> = {
      userId: this.userId,
      status: "received",
    };
    const sum = await PaymentTransferModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]).session(session ?? null);
    return sum[0]?.total || 0;
  }

  async transferredAmount(this: DocumentType<User>): Promise<number> {
    const sumColumn: _ModelColumn<PaymentTransferInsert> = "$netAmount";
    const match: ModelFind<PaymentTransferInsert> = {
      userId: this.userId,
      status: "transferred",
    };
    const sum = await PaymentTransferModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  }

  /**
   * get sum of the all the income of the user
   */
  async totalIncome(this: DocumentType<User>, session?: ClientSession) {
    const referralIncome = await this.referralIncome(session);
    const pairIncome = await this.pairIncome(session);
    const indirectReward = await this.indirectReward(session);
    return referralIncome + pairIncome + indirectReward;
  }

  /**
   * count total team amount
   */
  async totalTeam(this: DocumentType<User>) {
    const tree = await this.populateTree();
    const filter = {
      lft: { $gte: tree.lft },
      rgt: { $lte: tree.rgt },
    };
    const counts = await UserTreeModel.countDocuments(filter);
    return counts;
  }

  /**
   * sum of the referral income amount
   */
  async referralIncome(this: DocumentType<User>, session?: ClientSession) {
    const sumColumn: _ModelColumn<UserReferralIncomeInsert> = "$referralIncome";
    const match: ModelFind<UserReferralIncomeInsert> = {
      referralId: this.userId,
      status: "credit",
    };
    const sum = await UserReferralIncomeModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]).session(session ?? null);
    return sum[0]?.total || 0;
  }

  /**
   * sum of the pair income amount
   */
  async pairIncome(this: DocumentType<User>, session?: ClientSession) {
    const sumColumn: _ModelColumn<UserPairIncomeInsert> = "$pairIncome";
    const match: ModelFind<UserPairIncomeInsert> = {
      userId: this.userId,
      status: "credit",
    };
    const sum = await UserPairIncomeModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]).session(session ?? null);
    return sum[0]?.total || 0;
  }

  /**
   * sum of the indirect reward amount
   */
  async indirectReward(this: DocumentType<User>, session?: ClientSession) {
    const sumColumn: _ModelColumn<UserIndirectRewardInsert> = "$indirectReward";
    const match: ModelFind<UserIndirectRewardInsert> = {
      userId: this.userId,
      status: "credit",
    };
    const sum = await UserIndirectRewardModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]).session(session ?? null);
    return sum[0]?.total || 0;
  }

  /**
   *  get user direct referrals count
   */
  async directReferral(this: DocumentType<User>) {
    const filter: ModelFind<UserTreeInsert> = {
      referralId: this.userId,
    };
    const counts = await UserTreeModel.countDocuments(filter);
    return counts;
  }

  /**
   *  get user indirect referrals count
   */
  async indirectReferral(this: DocumentType<User>) {
    const filter: ModelFind<UserIndirectRewardInsert> = {
      userId: this.userId,
    };
    const counts = await UserIndirectRewardModel.countDocuments(filter);
    return counts;
  }

  /**
   * get user total deposit amount sum
   */
  async deposit(this: DocumentType<User>, session?: ClientSession) {
    const status: UserDepositInsert["status"][] = ["approved", "credit"];
    const sumColumn: _ModelColumn<UserDepositInsert> = "$netAmount";
    const match = {
      userId: this.userId,
      status: { $in: status },
    };
    const sum = await UserDepositModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]).session(session ?? null);
    return sum[0]?.total || 0;
  }

  /**
   * get user total withdraw amount sum
   */
  async withdraw(this: DocumentType<User>) {
    const sumColumn: _ModelColumn<UserWithdrawInsert> = "$amount";
    const match: ModelFind<UserWithdrawInsert> = {
      userId: this.userId,
      status: "success",
    };
    const sum = await UserWithdrawModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  }

  /**
   * get user last deposit amount
   */
  async lastDeposit(this: DocumentType<User>) {
    const status: UserDepositInsert["status"][] = ["approved", "credit"];
    const deposit = await UserDepositModel.findOne({
      userId: this.userId,
      status: { $in: status },
    }).sort({
      createdAt: -1,
    });
    return deposit?.amount || 0;
  }

  /**
   * get user last withdraw amount
   */
  async lastWithdraw(this: DocumentType<User>) {
    const filter: ModelFind<UserWithdrawInsert> = {
      userId: this.userId,
      status: "success",
    };
    const deposit = await UserWithdrawModel.findOne(filter).sort({
      createdAt: -1,
    });
    return deposit?.amount || 0;
  }

  /**
   * get user deposit amount in review
   */
  async depositInReview(this: DocumentType<User>) {
    const sumColumn: _ModelColumn<UserDepositInsert> = "$amount";
    const match: ModelFind<UserDepositInsert> = {
      status: "review",
    };
    const sum = await UserDepositModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  }

  /**
   * get user pending withdraw amount
   */
  async pendingWithdraw(this: DocumentType<User>): Promise<number> {
    const sumColumn: _ModelColumn<UserWithdrawInsert> = "$amount";
    const match: ModelFind<UserWithdrawInsert> = {
      userId: this.userId,
      status: "pending",
    };
    const sum = await UserWithdrawModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return sum[0]?.total || 0;
  }
}

export class User extends UserDashboard {
  isAdmin() {
    const role = this.role;
    return role === "admin";
  }

  /**
   * check if user can apply for kyc verification
   */
  async isReadyForKyc() {
    const setting = await getSettingInstance();
    const { contactDetails, kycVerification } = setting.siteConfiguration;
    if (!kycVerification) throw ClientError("kyc verification is not enabled");

    const contact = this.contact;
    if (contactDetails && !contact)
      throw ClientError("You must to add contact details to approve kyc");

    const details = this.kycDetails ?? {};
    const kycData = await KycFormModel.find();
    let isReady = true;
    kycData.every(({ _id, required }) => {
      const isRequired = required === "required";
      if (isRequired && !details[_id.toString()]) {
        isReady = false;
        return false;
      }
      return true;
    });
    return isReady;
  }

  /**
   * check if user is blocked
   */
  isBlocked(this: DocumentType<User>) {
    return this.status === "blocked";
  }

  /**
   * validate user password
   */
  async validatePassword(this: DocumentType<User>, loginPassword: string) {
    return bcrypt.compare(loginPassword, this.password);
  }

  /**
   * get user full name
   */
  getDisplayName(this: DocumentType<User>) {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * get user tree
   */
  async populateTree(this: DocumentType<User>) {
    const user = await this.populate("tree");
    return user.tree as UserTreeInsert;
  }

  /**
   * Check if userId is under the tree of the current user instance .
   */
  async isChildId(this: DocumentType<User>, childId: number): Promise<boolean> {
    const tree = await this.populateTree();
    const { lft, rgt } = tree;
    const row = await UserTreeModel.findOne({
      lft: { $gt: lft },
      rgt: { $lt: rgt },
      userId: childId,
    });
    return row !== null;
  }

  /**
   * get child placement side
   */
  async getChildPlacementSide(
    this: DocumentType<User>,
    childId: number,
    session: ClientSession
  ): Promise<PlacementSide> {
    const tree = await this.populateTree();
    if (this.userId === childId) return tree.placementSide;

    const child = await getUserTreeInstance(childId, session);
    const parentId = this.userId;
    let placementId = child.placementId;
    if (parentId === placementId) return child.placementSide;

    let placementSide: "left" | "right" | null = null;
    while (placementId !== parentId) {
      const user = await getUserTreeInstance(placementId, session);
      placementId = user.placementId;
      placementSide = user.placementSide;
    }
    if (!placementSide) throw new Error("Error in getting placement side");
    return placementSide;
  }

  /**
   * add referral income to the referral id after registration
   *  @this referralId
   */
  async addReferralIncome(
    this: DocumentType<User>,
    userId: number,
    session: ClientSession
  ): Promise<void> {
    const plan = await getPlanInstance();
    const referralIncome =
      this.isBlocked() || !this.isPremium ? 0 : plan.referralIncome;

    const transactionInput: TransactionInsert = {
      userId: this.userId,
      amount: referralIncome,
      category: "referral_income",
      charge: 0,
      netAmount: referralIncome,
      status: "credit",
      description: `referral income - ${userId}`,
    };
    // add to the transaction table
    const { _id: transactionId } = await createTransactionDocument(
      transactionInput,
      session
    );

    const referralIncomeInput: UserReferralIncomeInsert = {
      userId,
      referralId: this.userId,
      referralIncome,
      status: "credit",
      transactionId,
    };

    // add referral income to the referral id
    await UserServices.createUserReferralIncomeDocument(
      referralIncomeInput,
      session
    );
    await this.checkReactivation(session);
  }

  /**
   * update user ancestors left and right count and if pair match add pair income
   * @instance newUserId
   */
  async updateLeftRightCountAddPairIncome(
    this: DocumentType<User>,
    session: ClientSession
  ): Promise<void> {
    const tree = await this.populateTree();
    const { lft, rgt } = tree;
    const rows = await UserTreeModel.find({
      lft: { $lt: lft },
      rgt: { $gt: rgt },
    }).session(session);

    for await (const row of rows) {
      const { userId: parentId } = row;
      const ParentUser = await getUserInstance(parentId, { session });
      const ParentUserTree = await getUserTreeInstance(parentId, session);
      const placementSide = await ParentUser.getChildPlacementSide(
        this.userId,
        session
      );

      const leftCount = ParentUserTree.leftCount;
      const rightCount = ParentUserTree.rightCount;

      const placementSideCount = `${placementSide}Count` as const;
      ParentUserTree[placementSideCount] += 1;
      await ParentUserTree.save({ session });

      // update pair count
      if (
        leftCount >= 0 &&
        rightCount >= 0 &&
        ((placementSide === "left" && leftCount < rightCount) ||
          (placementSide === "right" && rightCount < leftCount))
      ) {
        ParentUserTree.pairCount += 1;
        await ParentUserTree.save({ session });
        await ParentUser.addPairIncome(session);
      }
    }
  }

  /**
   * add pair income
   */
  async addPairIncome(this: DocumentType<User>, session: ClientSession) {
    const plan = await getPlanInstance();
    const dailyPairCapping = plan.dailyPairCapping;
    const todayPairCount = await this.todayPairCount();

    let capping = false;
    let pairIncome = plan.pairIncome;

    if (this.isBlocked() || !this.isPremium) {
      pairIncome = 0;
    } else if (todayPairCount >= dailyPairCapping) {
      pairIncome = 0;
      capping = true;
    }

    // create transaction
    const transactionInput: TransactionInsert = {
      userId: this.userId,
      amount: pairIncome,
      charge: 0,
      netAmount: pairIncome,
      category: "pair_income",
      description: "pair income",
      status: "credit",
    };
    const { _id: transactionId } = await createTransactionDocument(
      transactionInput,
      session
    );

    // add pair income document
    const pairIncomeInput: UserPairIncomeInsert = {
      pairIncome,
      status: capping ? "capping" : "credit",
      transactionId,
      userId: this.userId,
    };
    await UserServices.createPairIncomeDocument(pairIncomeInput, session);
    await this.checkReactivation(session);
  }

  /**
   * get today pair count
   */
  async todayPairCount(this: DocumentType<User>) {
    const startDate = await getStartOfDay();
    const endDate = await getEndOfDay();
    const rows = await UserPairIncomeModel.countDocuments({
      userId: this.userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    return rows;
  }

  /**
   * get today indirect reward count
   */
  async todayIndirectRewardCount(this: DocumentType<User>) {
    const startDate = await getStartOfDay();
    const endDate = await getEndOfDay();

    const rows = await UserIndirectRewardModel.countDocuments({
      userId: this.userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
    return rows;
  }

  /**
   * "If the user has a referral, and that referral has no direct referrals, then the user's parent
   * referral gets an indirect referral reward."
   * @instance referralId
   * @returns a promise.
   */
  async checkParentIndirectReward(
    this: DocumentType<User>,
    session: ClientSession
  ): Promise<void> {
    const tree = await this.populateTree();
    const referralId = tree.referralId;
    const isUserId = await UserServices.isUserId(referralId, session);
    if (!isUserId) return;

    const parentUser = await getUserInstance(referralId);
    await parentUser.addIndirectReward(this.userId, session);
  }

  /**
   * add indirect reward
   * @instance same user to add indirect reward
   */
  async addIndirectReward(
    this: DocumentType<User>,
    referralId: number,
    session: ClientSession
  ): Promise<void> {
    const plan = await getPlanInstance();
    const dailyIndirectRewardCapping = plan.dailyIndirectRewardCapping;
    const todayIndirectReward = await this.todayIndirectRewardCount();

    let capping = false;
    let indirectReward = plan.indirectReward;
    if (this.isBlocked() || !this.isPremium) {
      indirectReward = 0;
    } else if (todayIndirectReward >= dailyIndirectRewardCapping) {
      indirectReward = 0;
      capping = true;
    }

    // create transaction
    const transactionInput: TransactionInsert = {
      userId: this.userId,
      amount: indirectReward,
      charge: 0,
      netAmount: indirectReward,
      category: "indirect_reward",
      description: "indirect reward",
      status: "credit",
    };
    const { _id: transactionId } = await createTransactionDocument(
      transactionInput,
      session
    );

    // add pair income document
    const indirectRewardInput: UserIndirectRewardInsert = {
      agentId: referralId,
      indirectReward,
      status: capping ? "capping" : "credit",
      transactionId,
      userId: this.userId,
    };
    await UserServices.createIndirectRewardDocument(
      indirectRewardInput,
      session
    );
    await this.checkReactivation(session);
  }

  /**
   * update placement user left id or right id
   * @instance PlacementUserId
   */
  async updatePlacementLeftRightId(
    this: DocumentType<User>,
    childId: number,
    placementSide: PlacementSide,
    session: ClientSession
  ): Promise<void> {
    const placementSideText = `${placementSide}Id` as const;

    await UserTreeModel.findOneAndUpdate(
      { userId: this.userId },
      { $set: { [placementSideText]: childId } },
      { session }
    );
  }

  /**
   * update user plan if wallet has sufficient amount for reactivation
   */
  async checkReactivationPlan(
    this: DocumentType<User>,
    session: ClientSession
  ): Promise<void> {
    const reactivation = await PlanService.getReactivation();
    if (!reactivation) return;

    const reactivationLevel = this.reactivationLevel;
    if (reactivationLevel === 3 || reactivationLevel > 2) return;

    const currentReactivation = reactivation[reactivationLevel];
    const { amountIncomeReached, payableAmount } = currentReactivation;

    const totalIncome = await this.totalIncome(session);
    if (totalIncome < amountIncomeReached) return;

    const wallet = await this.wallet(session);
    if (payableAmount > wallet) return;

    this.isPremium = true;
    await this.save({ session });
    await this.updateReactivationLevel({
      payableAmount,
      reactivationLevel,
      session,
    });
  }

  /**
   * check for user reactivation
   */
  async checkReactivation(
    this: DocumentType<User>,
    session: ClientSession
  ): Promise<void> {
    const reactivation = await PlanService.getReactivation();
    if (!reactivation) return;

    const reactivationLevel = this.reactivationLevel;
    if (reactivationLevel === 3 || reactivationLevel > 2) return;

    const currentReactivation = reactivation[reactivationLevel];
    const totalIncome = await this.totalIncome(session);
    const { amountIncomeReached, payableAmount } = currentReactivation;
    if (totalIncome < amountIncomeReached) return;

    const wallet = await this.wallet(session);

    //
    if (wallet < payableAmount) {
      this.isPremium = false;
      await this.save({ session });
      return;
    }

    await this.updateReactivationLevel({
      payableAmount,
      reactivationLevel,
      session,
    });
    await this.checkReactivation(session);
  }

  async updateReactivationLevel(
    this: DocumentType<User>,
    {
      payableAmount,
      reactivationLevel,
      session,
    }: {
      payableAmount: number;
      reactivationLevel: number;
      session: ClientSession;
    }
  ): Promise<void> {
    // create transaction
    const transactionDoc: TransactionInsert = {
      userId: this.userId,
      amount: payableAmount,
      charge: 0,
      netAmount: payableAmount,
      category: "reactivation",
      description: `reactivation - level ${reactivationLevel + 1}`,
      status: "debit",
    };
    await createTransactionDocument(transactionDoc, session);

    // update reactivation level
    this.reactivationLevel += 1;
    await this.save({ session });
  }
}

export type UserInsert = ModelInsert<
  User,
  | "status"
  | "role"
  | "isPremium"
  | "twoFA"
  | "kyc"
  | "kycDetails"
  | "reactivationLevel",
  "updatedAt" | "createdAt"
>;
export type UserRow = UserInsert & { _id: string };
const UserModel = getModelForClass(User);
export default UserModel;

/**
 * create user instance
 */
export const getUserInstance = async (
  userId: number,
  options?: { session?: ClientSession; error?: string; userName?: boolean }
) => {
  const session = options?.session || null;
  const error = options?.error || `User ${userId} not found`;
  const user = await UserModel.findOne({ userId })
    .select("+password")
    .session(session);
  if (!user) return ClientError(error);
  return user;
};
