import numeral from "numeral";
import { globals } from "./globals";

export function fCurrency(number: number) {
  const format = () => {
    if (globals.configuration.currencyPosition === "prefix")
      return Number.isInteger(number) ? "$0,0" : "$0,0.00";
    else return Number.isInteger(number) ? "0,0$" : "0,0.00$";
  };
  return numeral(number).format(format());
}

export function fPercent(number: number) {
  return numeral(number / 100).format("0.0%");
}

export function fNumber(number: number) {
  return numeral(number).format();
}

export function fShortenNumber(number: number) {
  return numeral(number).format("0.00a").replace(".00", "");
}

export function fData(number: number) {
  return numeral(number).format("0.0 b");
}

export const fShortCurrency = (number: number) => {
  return numeral(number).format(
    globals.configuration.currencyPosition === "prefix"
      ? "($0.00a)"
      : "(0.00a$)"
  );
};
