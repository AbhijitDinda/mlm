import { useState } from "react";
import { toast } from "react-toastify";
import { Axios } from "../utils/axios";

export type FileExtensions = (
  | "JPG"
  | "JPEG"
  | "PNG"
  | "WEBP"
  | "PDF"
  | "DOC"
  | "DOCX"
  | "TXT"
  | "XLX"
  | "XLSX"
  | "CSV"
)[];

export type Extension = "all" | `.${string}`[];
export const toExt = (fileExtensions: FileExtensions): Extension => {
  const val = fileExtensions.map((val) => `.${val?.toLowerCase?.()}`);
  return val as Extension;
};

export const PostUploadFile = (formData: any, headers: any) =>
  Axios.post("/upload", formData, headers);

const useUploadFile = (accept: Extension) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploadFile = async (formData: any) => {
    try {
      const { data } = await PostUploadFile(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Accept": accept,
        },
        onUploadProgress: (progressEvent: any) => {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          setProgress(progress);
        },
      });
      setIsSuccess(true);
      setProgress(0);
      return data;
    } catch (error: any) {
      setProgress(0);
      if (error.response.data.toastMessage) {
        toast.error(error?.response?.data?.toastMessage);
      }
    }
  };
  return { uploadFile, isSuccess, progress };
};

export default useUploadFile;
