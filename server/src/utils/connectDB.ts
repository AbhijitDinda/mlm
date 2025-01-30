import mongoose from "mongoose";
import { MONGODB_URI } from "../config";
import { log } from "./log";

export const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
      await mongoose.connect(MONGODB_URI);
    // log("database connected");
  } catch (error) {
    log("file: connectDB.ts:9 ~ connectDB ~ error", error);
  }
};
