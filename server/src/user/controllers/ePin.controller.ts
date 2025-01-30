import { UserContext } from "../../context";
import EPinModel from "../../models/epin.model";
import { searchDate, searchNonStr, searchStr } from "../../utils/mongo";
import { DataTableSchemaType } from "../schemas/table.schema";

export const getEPinListHandler = async ({
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
    assignedTo: userId,
    ...(searchKeyword && {
      $or: [
        searchStr("status", searchKeyword),
        searchStr("ePin", searchKeyword),
        searchNonStr("$usedBy", searchKeyword),
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
