import crypto from "crypto";
import { NextFunction, Response } from "express";
import multer from "multer";
import path from "path";
import { getApiFileUrl } from "./utils/fns";

const PUBLIC_DIR = path.join(__dirname, "../public/files");
const PRIVATE_DIR = path.join(__dirname, "../private/files");

const storage = (isPrivate: boolean) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, isPrivate ? PRIVATE_DIR : PUBLIC_DIR);
    },
    filename: (req, file, cb) => {
      const originalFileName = file.originalname;
      const paredFile = path.parse(originalFileName);
      const fileExt = paredFile.ext;
      const fileName = paredFile.name
        .toLowerCase()
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      const randomUUID = crypto.randomUUID();
      const now = Date.now();
      const fullFileName = `${randomUUID}-${now}-${fileName}${fileExt}`;
      cb(null, fullFileName);
    },
  });

const upload = (isPrivate: boolean) =>
  multer({
    storage: storage(isPrivate),
    fileFilter: (req, file, cb) => {
      const accept = <string>req.headers["x-accept"] ?? "";
      const exts = accept.replace(/\./g, "").split(",");
      if (accept !== "all") {
        const mimeType = file.mimetype;
        const mimeExt = mimeType.split("/")[1];
        if (exts.includes(mimeExt)) {
          cb(null, true);
        } else {
          cb(new Error(`Only ${accept} formats are allowed`));
        }
      } else {
        cb(null, true);
      }
    },
  }).single("file");

export const uploadFile = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const _private = <string>req.headers["x-private"] ?? "";
  const isPrivate = _private === "private";
  upload(isPrivate)(req, res, (err) => {
    if (err) {
      return next(err);
    }
    return res.send({
      fileName: req.file.filename,
      fileUrl: getApiFileUrl(req.file.filename, isPrivate),
    });
  });
};
