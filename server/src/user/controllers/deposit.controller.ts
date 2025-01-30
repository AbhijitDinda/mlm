import { UserContext } from "../../context";
import { HttpError } from "../../middleware/errors";
import UserDepositModel, {
  getDepositInstance,
  UserDepositRow,
} from "../../models/userDeposit.model";
import { toObjectId } from "../../utils/fns";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { StringSchemaType } from "../schemas/index.schema";
import { DataTableSchemaType } from "../schemas/table.schema";

export const getDepositHistoryListHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: DataTableSchemaType;
}) => {
  const { user } = ctx;
  const { userId } = user;

  const { pageIndex, pageSize, sortModel, searchFilter } = input;
  const { field, sort } = sortModel?.[0] ?? {};
  const sortOrder: 1 | -1 =
    (sort === "asc" && 1) || (sort === "desc" && -1) || 1;
  const skip = pageIndex * pageSize;
  const searchKeyword = searchFilter;

  const filter = {
    userId,
    ...(searchKeyword && {
      $or: [
        searchStr("status", searchKeyword),
        searchNonStr("$userId", searchKeyword),
        searchNonStr("$amount", searchKeyword),
        searchNonStr("$charge", searchKeyword),
        searchNonStr("$netAmount", searchKeyword),
        searchNonStr("$transactionId", searchKeyword),
        searchDate("$createdAt", searchKeyword),
        searchDate("$updatedAt", searchKeyword),
      ],
    }),
  };
  const query = UserDepositModel.find(filter).populate("gateway", "logo name");
  const rowCount = await UserDepositModel.countDocuments(filter);
  if (field) {
    query.sort({
      [field]: sortOrder,
    });
  }
  const rows = await query.skip(skip).limit(pageSize);
  return { rows, rowCount };
};

export const getDepositDetailHandler = async ({
  ctx,
  input,
}: {
  ctx: UserContext;
  input: StringSchemaType;
}): Promise<UserDepositRow> => {
  const { user } = ctx;
  const { userId } = user;
  const id = input;

  const deposit = await getDepositInstance(toObjectId(id));
  const _userId = deposit.userId;
  if (_userId !== userId)
    throw HttpError(`No deposit found for transaction ${id}`, "NOT_FOUND");

  return deposit;
};
