import EPinModel, { EPinInsert } from "../../models/epin.model";
import EPinTransferModel, {
  EPinTransferInsert,
} from "../../models/epinTransfer.model";
import UserModel, { getUserInstance } from "../../models/user.model";
import { EPinService } from "../../services/epin.service";
import { sendResponse } from "../../utils/fns";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { ModelFind, _ModelColumn } from "../../utils/types";
import { GenerateEPinSchemaType } from "../schemas/ePin.schema";
import { OptionalStringSchemaType } from "../schemas/index.schema";
import { DataTableSchemaType } from "../schemas/table.schema";

/**
 * get e-pin list table
 */
export const getEPinListHandler = async ({
  input,
}: {
  input: DataTableSchemaType;
}) => {
  const { pageIndex, pageSize, sortModel, searchFilter } = input;
  const { field, sort } = sortModel?.[0] ?? {};
  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;

  const filter = {
    ...(searchKeyword && {
      $or: [
        searchStr("ePin", searchKeyword),
        searchStr("status", searchKeyword),
        searchNonStr("$assignedTo", searchKeyword),
        searchNonStr("$registeredBy", searchKeyword),
        searchDate("$createdAt", searchKeyword),
      ],
    }),
  };
  const query = EPinModel.find(filter);
  const rowCount = await EPinModel.countDocuments(filter);
  if (field) {
    query.sort({
      [field]: sortOrder,
    });
  }
  const rows = await query.skip(skip).limit(pageSize);
  return { rows, rowCount };
};

/**
 * generate e-pins
 */
export const createEPinHandler = async ({
  input,
}: {
  input: GenerateEPinSchemaType;
}) => {
  const { ePins, userId } = input;
  if (userId !== 0) {
    await getUserInstance(userId, { error: `User ${userId} not exists` });
  }

  const ePinDocuments: EPinInsert[] = [];
  for (let i = 0; i < ePins; i++) {
    const ePin = EPinService.generateEPin();
    const ePinModel: EPinInsert = {
      ePin,
      status: "active",
      assignedTo: userId === 0 ? undefined : userId,
    };
    ePinDocuments.push(ePinModel);
  }
  await EPinModel.insertMany(ePinDocuments);

  if (userId !== 0) {
    const ePinTransferDoc: EPinTransferInsert = {
      ePins,
      userId,
    };
    const doc = new EPinTransferModel(ePinTransferDoc);
    await doc.save();
  }

  const message =
    userId !== 0
      ? `${ePins} E-Pins transferred to ${userId}`
      : `${ePins} E-Pins has been created `;

  return sendResponse(message);
};

/**
 * search user list for transfer e-pins
 */
export const searchTransferPaymentUserHandler = async ({
  input,
}: {
  input: OptionalStringSchemaType;
}) => {
  const search = input;

  if (search) {
    const find = {
      $or: [searchNonStr("$userId", search), searchStr("userName", search)],
    };
    const select = {
      userName: 1,
      userId: 1,
      firstName: 1,
      lastName: 1,
      avatar: 1,
    };
    const users = await UserModel.find(find).select(select).limit(10);
    return users;
  } else {
    const users = await EPinTransferModel.aggregate([
      {
        $lookup: {
          from: UserModel.collection.name,
          localField: "userId",
          foreignField: "userId",
          as: "agent",
        },
      },
      {
        $unwind: "$agent",
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$userId",
          createdAt: { $first: "$createdAt" },
          userId: { $first: "$userId" },
          userName: { $first: "$agent.userName" },
          firstName: { $first: "$agent.firstName" },
          lastName: { $first: "$agent.lastName" },
          avatar: { $first: "$agent.avatar" },
        },
      },
    ]);
    return users;
  }
};

/**
 * transfer e-pins list
 */
export const getTransferListHandler = async ({
  input,
}: {
  input: DataTableSchemaType;
}) => {
  const { pageIndex, pageSize, sortModel, searchFilter } = input;
  const { field, sort } = sortModel?.[0] ?? {};

  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;

  const pipeline = [
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "userId",
        as: "user",
      },
    },
    {
      $addFields: {
        displayName: {
          $concat: [
            { $arrayElemAt: ["$user.firstName", 0] },
            " ",
            { $arrayElemAt: ["$user.lastName", 0] },
          ],
        },
      },
    },
    {
      $match: {
        ...(searchKeyword && {
          $or: [
            searchNonStr("$userId", searchKeyword),
            searchNonStr("$ePins", searchKeyword),
            searchStr("user.avatar", searchKeyword),
            searchStr("user.email", searchKeyword),
            searchStr("user.userName", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchDate("$createdAt", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        ePins: 1,
        createdAt: 1,
        userId: 1,
        displayName: 1,
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
        email: { $arrayElemAt: ["$user.email", 0] },
        userName: { $arrayElemAt: ["$user.userName", 0] },
      },
    },
    {
      $facet: {
        rows: [
          ...(field
            ? [
                {
                  $sort: {
                    [field]: sortOrder,
                  },
                },
              ]
            : []),
          {
            $skip: skip,
          },
          {
            $limit: pageSize,
          },
        ],
        count: [
          {
            $count: "rowCount",
          },
        ],
      },
    },
  ];

  const data = await EPinTransferModel.aggregate(pipeline);
  return { rowCount: data[0]?.count[0]?.rowCount ?? 0, rows: data[0].rows };
};

/**
 * e-pins summary
 */
export const ePinSummaryHandler = async () => {
  const countTransferredEPins = async () => {
    const sumColumn: _ModelColumn<EPinTransferInsert> = "$ePins";
    const sum = await EPinTransferModel.aggregate([
      { $group: { _id: null, total: { $sum: sumColumn } } },
    ]);
    return ((sum[0]?.total ?? 0) as number) || 0;
  };
  const countActiveEPins = async () => {
    const find: ModelFind<EPinInsert> = {
      status: "active",
    };
    const ePins = await EPinModel.countDocuments(find);
    return ePins;
  };
  const countExpiredEPins = async () => {
    const find: ModelFind<EPinInsert> = {
      status: "expired",
    };
    const ePins = await EPinModel.countDocuments(find);
    return ePins;
  };
  const countActiveTransferredEPins = async () => {
    const find = {
      status: "active",
      assignedTo: { $exists: true },
    };
    const counts = await EPinModel.countDocuments(find);
    return counts;
  };
  const countExpiredTransferredEPins = async () => {
    const find = {
      status: "expired",
      assignedTo: { $exists: true },
    };
    const counts = await EPinModel.countDocuments(find);
    return counts;
  };

  const totalEPins = await EPinModel.countDocuments();
  const transferredEPins = await countTransferredEPins();
  const activeEPins = await countActiveEPins();
  const expiredEPins = await countExpiredEPins();

  const transferredSummary = {
    active: await countActiveTransferredEPins(),
    expired: await countExpiredTransferredEPins(),
  };

  return {
    totalEPins,
    activeEPins,
    transferredEPins,
    expiredEPins,
    transferredSummary,
  };
};
