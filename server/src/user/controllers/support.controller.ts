import { UserContext } from "../../context";
import { ClientError } from "../../middleware/errors";
import TicketModel, {
  getTicketInstance,
  TicketInsert,
  TicketRow,
} from "../../models/ticket.model";
import { createTicketDocument } from "../../services/support.service";
import { getSuperAdmin } from "../../services/user.service";
import { sendResponse, toObjectId } from "../../utils/fns";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { StringSchemaType } from "../schemas/index.schema";
import { CreateTicketSchemaType } from "../schemas/support.schema";
import { DataTableSchemaType } from "../schemas/table.schema";

/**
 * create ticket
 */
export const createTicketHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: CreateTicketSchemaType;
}) => {
  const {
    user: { _id, userId },
  } = ctx;

  const { subject, files, isReply, message, _id: ticketId } = input;

  if (!isReply) {
    const ticketDoc: TicketInsert = {
      status: "pending",
      subject,
      user: _id,
      userId,
      messages: [{ files, userId, message }],
    };
    await createTicketDocument(ticketDoc);
    return sendResponse("Ticket has been created");
  } else {
    if (!ticketId) throw ClientError("No ticket id provided.");
    const _ticketId = toObjectId(ticketId);
    const ticket = await getTicketInstance(_ticketId);

    ticket.messages.push({ files, userId, message });
    await ticket.save();
    return sendResponse("Reply has been added");
  }
};

/**
 * get ticket data
 */
export const getTicketHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: StringSchemaType;
}): Promise<
  TicketRow & {
    pic: {
      user: {
        avatar?: string;
        displayName: string;
      };
      admin: {
        avatar?: string;
        displayName: string;
      };
    };
  }
> => {
  const _id = toObjectId(input);
  const { user } = ctx;
  const { userId, avatar } = user;
  const displayName = user.getDisplayName();

  const ticket = await getTicketInstance(_id);
  if (ticket.userId !== userId)
    throw ClientError("You don't have permission to access this ticket.");

  const admin = await getSuperAdmin();
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

/**
 * get all tickets list
 */
export const getTicketsListHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: DataTableSchemaType;
}) => {
  const {
    user: { userId },
  } = ctx;

  const { pageIndex, pageSize, sortModel, searchFilter } = input;
  const { field, sort } = sortModel?.[0] ?? {};

  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;

  const data = await TicketModel.aggregate([
    {
      $match: {
        userId,
        ...(searchKeyword && {
          $or: [
            searchDate("$createdAt", searchKeyword),
            searchDate("$updatedAt", searchKeyword),
            searchStr("subject", searchKeyword),
            searchStr("status", searchKeyword),
            searchNonStr("$_id", searchKeyword),
          ],
        }),
      },
    },
    {
      $project: {
        status: 1,
        subject: 1,
        updatedAt: 1,
        createdAt: 1,
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

/**
 * close ticket
 */
export const closeTicketHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: StringSchemaType;
}) => {
  const _id = toObjectId(input);
  const {
    user: { userId },
  } = ctx;
  const ticket = await getTicketInstance(_id);
  if (ticket.userId !== userId)
    throw ClientError("You don't have permission to access this ticket.");
  if (ticket.status === "closed")
    throw ClientError("This ticket has been closed.");

  ticket.status = "closed";
  ticket.closedBy = "user";
  await ticket.save();
  return sendResponse("Ticket has been closed");
};
