import numeral from "numeral";
import { createContext } from "react";
import ApiError from "../components/ApiError";
import LoadingScreen from "../components/LoadingScreen";
import { initialState } from "../config";
import { trpc } from "../trpc";
import { globals } from "../utils/globals";

const ConfigurationContext = createContext(initialState);
const ConfigurationProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, isSuccess, isLoading, error } =
    trpc.setting.configuration.useQuery(undefined, {
      onSuccess(data) {
        if (!data) return;
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
      },
    });
  const configData = data ?? initialState;

  if (error) return <ApiError error={error} />;

  return (
    <ConfigurationContext.Provider value={configData}>
      {isLoading ? <LoadingScreen /> : children}
    </ConfigurationContext.Provider>
  );
};

export { ConfigurationProvider, ConfigurationContext };
