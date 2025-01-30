import { useState } from "react";
import { toast } from "react-toastify";
import { Axios } from "../../utils/axios";

const downloadProduct = (id: string) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const download = async () => {
    if (isDownloading) return;
    try {
      setIsDownloading(true);
      const response = await Axios.get(`/product/download/${id}`, {
        responseType: "blob",
      });
      const fileName = response.headers.filename;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error: any) {
      try {
        let responseText = await error.response.data.text();
        const responseObj = JSON.parse(responseText);
        if (responseObj.toastMessage) {
          toast.error(responseObj.toastMessage);
        } else {
          console.log(error);
          toast.error("Something went wrong");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, download };
};

export { downloadProduct };
