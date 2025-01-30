import { AdminContext } from "../../context";
import { ClientError } from "../../middleware/errors";
import TicketModel, {
  getTicketInstance,
  TicketRow
} from "../../models/ticket.model";
import UserModel, { getUserInstance } from "../../models/user.model";
import { getSuperAdmin } from "../../services/user.service";
import { sendResponse, toObjectId } from "../../utils/fns";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { StringSchemaType } from "../schemas/index.schema";
import { AddTicketReplySchemaType } from "../schemas/support.schema";
import { SupportTableSchemaType } from "../schemas/table.schema";

export const getTicketsListHandler = async ({
  input,
}: {
  input: SupportTableSchemaType;
}) => {
  const { status, table } = input;
  const { pageIndex, pageSize, sortModel, searchFilter } = table;
  const { field, sort } = sortModel?.[0] ?? {};

  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;

  const data = await TicketModel.aggregate([
    {
      $lookup: {
        from: UserModel.collection.name,
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
        ...(status !== "all" && {
          status: status,
        }),
        ...(searchKeyword && {
          $or: [
            searchDate("$createdAt", searchKeyword),
            searchDate("$updatedAt", searchKeyword),
            searchStr("status", searchKeyword),
            searchStr("user.avatar", searchKeyword),
            searchStr("user.email", searchKeyword),
            searchStr("user.userName", searchKeyword),
            searchStr("displayName", searchKeyword),
            searchNonStr("$userId", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        status: 1,
        subject: 1,
        email: 1,
        userId: 1,
        displayName: 1,
        createdAt: 1,
        updatedAt: 1,
        avatar: { $arrayElemAt: ["$user.avatar", 0] },
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
  ]);
  return { rowCount: data[0]?.count[0]?.rowCount ?? 0, rows: data[0].rows };
};

export const getTicketHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const _id = toObjectId(input);
  const ticket = await getTicketInstance(_id);
  const admin = await getSuperAdmin();
  const user = await getUserInstance(ticket.userId);
  const avatar = user.avatar;
  const displayName = user.getDisplayName();
  const { userId: adminUserId, avatar: adminAvatar } = admin;
  const adminDisplayName = admin.getDisplayName();

  const pic = {
    user: {
      avatar,
      displayName,
    },
    admin: { avatar: adminAvatar, displayName: adminDisplayName },
  };
  const doc = <TicketRow>ticket.toJSON();
  return Object.assign(doc, { pic });
};

export const closeTicketHandler = async ({
  input,
}: {
  input: StringSchemaType;
}) => {
  const _id = toObjectId(input);
  const ticket = await getTicketInstance(_id);
  if (ticket.status === "closed")
    throw ClientError("This ticket has been closed.");

  ticket.status = "closed";
  ticket.closedBy = "admin";
  await ticket.save();
  return sendResponse("Ticket has been closed");
};

export const addReplyHandler = async ({
  ctx,
  input,
}: {
  input: AddTicketReplySchemaType;
  ctx: AdminContext;
}) => {
  const { admin } = ctx;
  const { userId } = admin;

  const { files, message, _id: ticketId } = input;
  const _ticketId = toObjectId(ticketId);
  const ticket = await getTicketInstance(_ticketId);
  if (ticket.status === "closed")
    throw ClientError("This ticket has been closed.");

  ticket.messages.push({ files, userId, message });
  ticket.status = "active";
  await ticket.save();
  return sendResponse("Reply has been added");
};
