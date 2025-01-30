import fetch from "cross-fetch";
import type { Details } from "express-useragent";
import { ClientSession, Schema, Types } from "mongoose";
import { MAX_LOGIN_SESSION } from "../config";
import { ClientError } from "../middleware/errors";
import KycFormModel, { KycFormRow } from "../models/kycForm.model";
import LoginSessionModel, {
  LoginSessionInsert,
} from "../models/loginSession.model";
import { Roles } from "../models/schemas/user.schema";
import { PlacementSide } from "../models/schemas/userTree.schema";
import SettingModel, { SettingInsert } from "../models/setting.model";
import UserModel, { UserInsert, getUserInstance } from "../models/user.model";
import UserIndirectRewardModel, {
  UserIndirectRewardInsert,
} from "../models/userIndirectReward.model";
import UserKycModel from "../models/userKyc.model";
import UserPairIncomeModel, {
  UserPairIncomeInsert,
} from "../models/userPairIncome.model";
import UserReferralIncomeModel, {
  UserReferralIncomeInsert,
} from "../models/userReferralIncome.model";
import UserTreeModel, {
  UserTree,
  UserTreeInsert,
} from "../models/userTree.model";
import { getDateTime } from "../utils/time";
import { ModelFind, ModelSelect } from "../utils/types";

export namespace UserServices {
  // generate user id
  export const generateUserId = async (): Promise<number> => {
    const startingUserId = 1006090;
    const user = await UserModel.findOne().sort({ userId: "desc" });
    if (!user) return startingUserId;
    const newUserId = user.userId + 1;
    return newUserId;
  };

  // create a new user
  export const createUserDocument = async (
    input: UserInsert,
    session: ClientSession
  ) => {
    const user = new UserModel(input);
    await user.save({ session });
    return user;
  };

  // create user tree
  export const createUserTreeDocument = async (
    input: UserTreeInsert,
    session: ClientSession
  ) => {
    const user = new UserTreeModel(input);
    await user.save({ session });
    return user;
  };

  // check if user
  export const findUserById = async (
    id: Schema.Types.ObjectId,
    session?: ClientSession
  ) => {
    const query = UserModel.findById(id).lean();
    if (session) {
      query.session(session);
    }
    const user = await query.exec();
    return user;
  };

  // check if user
  export const findUserByUserId = async (
    userId: number,
    session?: ClientSession
  ) => {
    const query = UserModel.findOne({ userId }).lean();
    if (session) {
      query.session(session);
    }
    const user = await query.exec();
    return user;
  };

  /**
   * find user by user id and user name
   *
   */
  export const findUserByIdOrName = async (
    userId: number | string,
    session?: ClientSession
  ) => {
    const query = UserModel.findOne({
      userId,
    }).select("+password");
    if (session) {
      query.session(session);
    }
    const user = await query.exec();
    return user;
  };

  /**
   * check if user id exist
   */
  export const isUserId = async (userId: number, session?: ClientSession) => {
    const query = UserModel.findOne({ userId });
    if (session) {
      query.session(session);
    }
    const user = await query.exec();
    return user !== null;
  };

  /**
   * check if user name exist
   */
  export const isUserName = async (
    userName: string,
    session?: ClientSession
  ) => {
    const query = UserModel.findOne({ userName });
    if (session) {
      query.session(session);
    }
    const user = await query.exec();
    return user !== null;
  };

  /**
   * get user id by user name
   */
  export const getUserIdByName = async (userName: string): Promise<number> => {
    const query = UserModel.findOne({ userName });
    const user = await query.exec();
    if (!user) throw new Error("No user with user name " + userName);
    return user.userId;
  };

  /**
   * get accounts register with email
   */
  export const registeredAccounts = async (email: string) => {
    const toSelect: ModelFind<UserInsert> = {
      email,
    };
    const row = await UserModel.countDocuments(toSelect);
    return row;
  };

  /**
   * check if email register is under email registration limit
   */
  export const validateRegisterEmailLimit = async (email: string) => {
    const toSelect: ModelSelect<SettingInsert> = {
      emailAccountLimit: 1,
    };
    const row = await SettingModel.findOne().select(toSelect);
    if (!row) return;

    const { emailAccountLimit } = row;
    if (emailAccountLimit === 0) return;

    const accounts = await registeredAccounts(email);
    if (accounts >= emailAccountLimit)
      return ClientError(
        `Maximum ${emailAccountLimit} accounts are allowed per email`
      );
  };

  /**
   * create user tree instance
   */
  export const userTreeInstance = async (
    userId: number,
    populate?: boolean
  ) => {
    const query = UserTreeModel.findOne({
      userId,
    });
    if (populate) query.populate("user");
    const userTree = await query.exec();
    if (!userTree) return ClientError(`${userId} user id not found`);
    return userTree;
  };

  /**
   * "Get the placement id for a new user registration, given the referral id and the placement side."
   *
   * The function is called like this:
   * @param {number} referralId - The user id of the person who referred the new user.
   * @param {"left" | "right"} placementSide - "left" | "right"
   * @returns The placementId for the user.
   */
  export const getPlacementIdForRegistration = async (
    referralId: number,
    placementSide: PlacementSide
  ): Promise<number> => {
    const userTree = await UserTreeModel.findOne({ userId: referralId });
    if (!userTree) return ClientError("Referral Id not found");

    let leftId = userTree.leftId;
    let rightId = userTree.rightId;

    switch (placementSide) {
      case "left":
        if (leftId) {
          const isLeftId = await isUserId(leftId);
          while (isLeftId) {
            const userTree: UserTree = await userTreeInstance(leftId);
            const currentLeftId = userTree.leftId;
            if (currentLeftId) {
              leftId = currentLeftId;
            } else break;
          }
        }
        return leftId ? leftId : referralId;
      case "right":
        if (rightId) {
          const isRightId = await isUserId(rightId);
          while (isRightId) {
            const userTree: UserTree = await userTreeInstance(rightId);
            const currentRightId = userTree.rightId;
            if (currentRightId) rightId = currentRightId;
            else break;
          }
        }
        return rightId ? rightId : referralId;
      default:
        throw new Error("Unknown placement side: " + placementSide);
    }
  };

  /**
   * create referral income
   */
  export const createUserReferralIncomeDocument = async (
    input: UserReferralIncomeInsert,
    session: ClientSession
  ) => {
    const row = new UserReferralIncomeModel(input);
    await row.save({ session });
    return row;
  };

  /**
   * create pair income document
   */
  export const createPairIncomeDocument = async (
    input: UserPairIncomeInsert,
    session: ClientSession
  ) => {
    const row = new UserPairIncomeModel(input);
    await row.save({ session });
    return row;
  };

  /**
   * create user indirect reward income document
   */
  export const createIndirectRewardDocument = async (
    input: UserIndirectRewardInsert,
    session: ClientSession
  ) => {
    const row = new UserIndirectRewardModel(input);
    await row.save({ session });
    return row;
  };

  /**
   * clear login session greater than 100
   */
  export const checkUserLoginSessionLimit = async (
    userId: number
  ): Promise<void> => {
    const counts = await LoginSessionModel.countDocuments({ userId });
    if (counts < MAX_LOGIN_SESSION) return;
    await LoginSessionModel.deleteOne({ userId }).sort({ createdAt: "desc" });
  };

  /**
   * create login session
   */
  export const createUserLoginSession = async ({
    userId,
    token,
    ip,
    remember,
    session,
    userAgent,
    agent = "user",
  }: {
    userId: number;
    token: string;
    ip: string;
    remember: boolean;
    session?: ClientSession;
    userAgent?: Details;
    agent?: Roles;
  }) => {
    let browser = "",
      os = "",
      device = "",
      country = "",
      region = "",
      city = "";

    try {
      interface IpRes {
        country: string;
        regionName: string;
        city: string;
      }

      const res = await fetch(`http://ip-api.com/json/${ip}`);
      const response: IpRes = await res.json();

      if (response.country) country = response.country;
      if (response.regionName) region = response.regionName;
      if (response.city) city = response.city;
    } catch (error) {}

    if (userAgent) {
      const {
        isMobile,
        isTablet,
        isiPad,
        isiPod,
        isiPhone,
        isAndroid,
        isDesktop,
        browser: browserText,
        os: osText,
      } = userAgent;
      browser = browserText;
      os = osText;

      if (isMobile) device = "Mobile";
      if (isTablet) device = "Tablet";
      if (isiPad) device = "IPad";
      if (isiPod) device = "IPod";
      if (isiPhone) device = "Phone";
      if (isAndroid) device = "Android";
      if (isDesktop) device = "Computer";
    }

    const validTill = getDateTime("add", remember ? 7 : 1, "days");
    const sessionData: LoginSessionInsert = {
      userId,
      token,
      validTill,
      ip,
      country,
      region,
      city,
      status: "active",
      agent,
      browser,
      os,
      device,
    };
    return await createUserLoginSessionDocument(sessionData, session);
  };

  /**
   * create user login session document
   */
  export const createUserLoginSessionDocument = async (
    input: LoginSessionInsert,
    session?: ClientSession
  ) => {
    const row = new LoginSessionModel(input);
    await row.save({ session: session ?? null });
    return row;
  };

  /**
   * get last kyc
   */
  export const getLastKyc = async (userId: number) => {
    const kyc = await UserKycModel.findOne({ userId });
    return kyc;
  };

  /**
   * get profile details
   */
  export const getUserProfileDetails = async (userId: number) => {
    const user = await getUserInstance(userId);
    const {
      email,
      firstName,
      lastName,
      mobileNumber,
      userName,
      avatar,
      createdAt,
      status,
      isPremium,
      kyc,
      kycDetails,
      twoFA,
      reactivationLevel,
    } = user;

    const tree = await user.populateTree();
    const { referralId, placementId, placementSide } = tree;
    const displayName = user.getDisplayName();
    const _lastKyc = kyc === "rejected" ? await getLastKyc(userId) : null;
    const kycFormData = <KycFormRow[]>await KycFormModel.find();
    const userContact = user.contact;
    const lastKyc: { status: typeof kyc; message?: string } = _lastKyc ?? {
      status: kyc,
      message: "",
    };

    return {
      userId,
      displayName,
      email,
      firstName,
      lastName,
      mobileNumber,
      userName,
      avatar,
      createdAt,
      status,
      isPremium,
      kyc,
      kycData: {
        user: kycDetails ?? {},
        form: kycFormData,
      },
      twoFA,
      referralId,
      lastKyc,
      contact: userContact,
      reactivationLevel,
      placementId,
      placementSide,
    };
  };

  /**
   * get login session id by token
   */
  export const getLoginSessionIdByToken = async (token: string) => {
    const session = await LoginSessionModel.findOne({ token });
    if (!session) throw ClientError("No session found");
    const { _id } = session;
    return _id as Types.ObjectId;
  };
}

/**
 * get super admin
 */
export const getSuperAdmin = async () => {
  const user = await UserModel.findOne({ role: "admin" });
  if (!user) throw Error("No super admin found");
  return user;
};
