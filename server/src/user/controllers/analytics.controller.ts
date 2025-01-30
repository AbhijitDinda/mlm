import dayjs from "dayjs";
import { UserContext } from "../../context";
import UserModel from "../../models/user.model";
import UserTreeModel, {
  getUserTreeInstance,
} from "../../models/userTree.model";
import { AnalyticJoiningSchemaType } from "../schemas/analytics.schema";

namespace Analytics {
  export const getUserTeamJoining = async (
    userId: number,
    startDate: Date,
    endDate: Date
  ) => {
    const user = await getUserTreeInstance(userId);
    const lft = user.lft;
    const rgt = user.rgt;

    const result = await UserTreeModel.aggregate([
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "userId",
          foreignField: "userId",
          as: "users",
        },
      },
      {
        $match: {
          lft: { $gte: lft },
          rgt: { $lte: rgt },
          "users.createdAt": {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $count: "count",
      },
    ]);

    return result?.[0]?.count || 0;
  };

  export const getUserReferralJoining = async (
    userId: number,
    startDate: Date,
    endDate: Date
  ) => {
    const result = await UserTreeModel.aggregate([
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "userId",
          foreignField: "userId",
          as: "users",
        },
      },
      {
        $match: {
          referralId: userId,
          "users.createdAt": {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $count: "count",
      },
    ]);

    return result?.[0]?.count || 0;
  };
}

export const getTeamAndJoiningHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: AnalyticJoiningSchemaType;
}) => {
  const { user } = ctx;
  const { userId } = user;
  const { startDate: _startDate, endDate: _endDate, offset } = input;

  const startDate = dayjs(_startDate)
    .add(-offset * 60, "seconds")
    .utc()
    .startOf("day")
    .add(offset * 60, "seconds");
  const endDate = dayjs(_endDate)
    .add(-offset * 60, "seconds")
    .utc()
    .startOf("day")
    .add(offset * 60, "seconds");

  const team: number[] = [];
  const referral: number[] = [];
  const categories: string[] = [];

  let fromDate = startDate;
  const toDate = endDate.add(1, "day");

  do {
    const sDate = fromDate.toDate();
    const eDate = dayjs(fromDate).add(1, "day").subtract(1, "second").toDate();

    const _team = await Analytics.getUserTeamJoining(userId, sDate, eDate);
    const _referral = await Analytics.getUserReferralJoining(
      userId,
      sDate,
      eDate
    );

    team.push(_team - _referral);
    referral.push(_referral);
    
    categories.push(fromDate.toISOString());
    fromDate = fromDate.add(1, "day");
  } while (fromDate.isBefore(toDate, "day"));

  return { team, referral, categories };
};
