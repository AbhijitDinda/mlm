import fs from "fs";
import { _log } from "../app";
import { NODE_ENV } from "../config";
import { currentDateTime } from "./time";

export const log = (...data: any) => {
  _log(data);
  if (NODE_ENV !== "development") return;

  const isFileExist = fs.existsSync("log.json");
  if (!isFileExist) fs.writeFileSync("log.json", JSON.stringify([]));

  // read log file
  const logs: any[] = JSON.parse(fs.readFileSync("log.json", "utf-8"));
  logs.push({
    time: currentDateTime(),
    data,
  });

  // append data
  fs.writeFileSync("log.json", JSON.stringify(logs));
};
