import { LinearProgress } from "@mui/material";
import numeral from "numeral";
import { createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initialState } from "../config";
import APP_PATH from "../routes/paths";
import { trpc } from "../trpc";
import { isObjEmpty } from "../utils/fns";
import { globals } from "../utils/globals";

const ConfigurationContext = createContext(initialState);
const ConfigurationProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { data, error, isSuccess, isLoading } =
    trpc.setting.configuration.useQuery();
  const configData = data ?? initialState;

  useEffect(() => {
    if (error?.data?.httpStatus === 412) navigate(APP_PATH.install);
  }, [error]);

  useEffect(() => {
    if (isSuccess && data && !isObjEmpty(data)) {
      globals.configuration = data;
      localStorage.setItem("configuration", JSON.stringify(data));
      if (!numeral.locales.fr) {
        numeral.register("locale", "fr", {
          delimiters: {
            thousands: ",",
            decimal: ".",
          },
          abbreviations: {
            thousand: "k",
            million: "m",
            billion: "b",
            trillion: "t",
          },
          ordinal: function (number) {
            return number === 1 ? "er" : "ème";
          },
          currency: {
            symbol: data.currency,
          },
        });
        numeral.locale("fr");
      }
    }
  }, [data]);

  return (
    <ConfigurationContext.Provider value={configData}>
      {isLoading ? <LinearProgress /> : children}
    </ConfigurationContext.Provider>
  );
};

export { ConfigurationProvider, ConfigurationContext };
