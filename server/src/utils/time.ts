import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { getTimeZone } from "../services/setting.service";

dayjs.extend(utc);
dayjs.extend(timezone);
export const currentDateTime = () => dayjs().utc().format();
export const dbDateTime = () => dayjs().utc().toDate();

export const getDateTime = (
  action: "add" | "subtract",
  input: number,
  unit: dayjs.ManipulateType
) => {
  if (action === "add") {
    return dayjs().add(input, unit).toDate();
  }
  return dayjs().subtract(input, unit).toDate();
};

export const getStartOfDay = async () => {
  const timeZone = await getTimeZone();
  return dayjs().tz(timeZone).startOf("day").utc();
};

export const getEndOfDay = async () => {
  const timeZone = await getTimeZone();
  return dayjs().tz(timeZone).endOf("day").utc();
};

export const getLocalStartOfDay = async () => {
  const timeZone = await getTimeZone();
  return dayjs().startOf("day").tz(timeZone, true).toDate();
};

export const getLocalEndOfDay = async () => {
  const timeZone = await getTimeZone();
  return dayjs().endOf("day").tz(timeZone, true).toDate();
};
