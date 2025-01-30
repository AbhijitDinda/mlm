import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, "../.env") });

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import cors from "cors";
import express from "express";
import useragent from "express-useragent";
import helmet from "helmet";
import { adminRouter } from "./admin/routers";
import { PORT } from "./config";
import { createContext } from "./context";
import { downloadProduct } from "./downloadProduct";
import { ErrorHandler } from "./middleware/errors";
import { uploadFile } from "./upload";
import { userRouter } from "./user/routers";
import { connectDB } from "./utils/connectDB";
import { log } from "./utils/log";

// app
const app = express();
const publicDir = path.join(__dirname, "../public");

// if (NODE_ENV === "development") {
//   app.use(async (req, res, next) => {
//     await new Promise((resolve) => setTimeout(resolve, 200));
//     next();
//   });
// }

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(
  cors({
    exposedHeaders: "fileName",
  })
);

// app.get("*", (req, res, next) => {
//   if (req.path.split("/")[1] !== "public") getLimiter(req, res, next);
//   else next();
// });
// app.post("*", postLimiter);

app.set("trust proxy", true);
app.use(useragent.express());

app.use(
  "/trpc/user",
  createExpressMiddleware({
    router: userRouter,
    createContext,
  })
);
app.use(
  "/trpc/admin",
  createExpressMiddleware({
    router: adminRouter,
    createContext,
  })
);

app.use("/public", express.static(publicDir));
app.use("/upload", uploadFile);
app.get("/product/download/:id", downloadProduct);
app.use(ErrorHandler);

app.listen(PORT, () => {
  connectDB();
  log(`Listening to the http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  return res.send("I am Listening. Welcome to the api");
});

export const _log = console.log;
console.log = (...text: any) => {
  log("--->", text);
};

export type UserAppRouter = typeof userRouter;
export type AdminAppRouter = typeof adminRouter;
