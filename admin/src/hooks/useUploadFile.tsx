import { useState } from "react";
import { toast } from "react-toastify";
import { Axios } from "../utils/axios";

export const PostUploadFile = (formData: any, headers: any) =>
  Axios.post("/upload", formData, headers);

export type Extension = "all" | `.${string}`[];
const useUploadFile = (accept: Extension, isPrivate?: boolean) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const uploadFile = async (formData: any) => {
    try {
      const { data } = await PostUploadFile(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-Accept": accept,
          ...(isPrivate && {
            "X-Private": "private",
          }),
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
