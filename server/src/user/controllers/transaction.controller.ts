import { UserContext } from "../../context";
import { ClientError } from "../../middleware/errors";
import TransactionModel, {
  getTransactionInstance,
  TransactionRow,
} from "../../models/transaction.model";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { StringSchemaType } from "../schemas/index.schema";
import { DataTableSchemaType } from "../schemas/table.schema";

export const getTransactionsListHandler = async ({
  input,
  ctx,
}: {
  input: DataTableSchemaType;
  ctx: UserContext;
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
        searchStr("description", searchKeyword),
        searchNonStr("$userId", searchKeyword),
        searchNonStr("$amount", searchKeyword),
        searchNonStr("$charge", searchKeyword),
        searchNonStr("$netAmount", searchKeyword),
        searchNonStr("$_id", searchKeyword),
        searchDate("$createdAt", searchKeyword),
        searchDate("$updatedAt", searchKeyword),
      ],
    }),
  };
  const query = TransactionModel.find(filter);
  const rowCount = await TransactionModel.countDocuments(filter);
  if (field) {
    query.sort({
      [field]: sortOrder,
    });
  }
  const rows = await query.skip(skip).limit(pageSize);
  return { rows, rowCount };
};

export const getTransactionsDataHandler = async ({
  input,
  ctx,
}: {
  input: StringSchemaType;
  ctx: UserContext;
}): Promise<TransactionRow> => {
  const { user } = ctx;
  const { userId } = user;
  const transactionId = input;
  const transaction = await getTransactionInstance(transactionId);
  if (transaction.userId !== userId)
    throw ClientError(`No transaction found for id ${transactionId}`);
  return transaction;
};
