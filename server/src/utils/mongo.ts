export const searchStr = (field: string, text: string) => {
  return {
    [field]: { $regex: text, $options: "i" },
  };
};

type StartWithDollar = `$${string}`;
export const searchNonStr = (field: StartWithDollar, text: string) => {
  return {
    $expr: {
      $regexMatch: {
        input: { $toString: field },
        regex: text,
        options: "i",
      },
    },
  };
};

export const searchDate = (field: StartWithDollar, text: string) => {
  return {
    $expr: {
      $regexMatch: {
        input: {
          $dateToString: {
            format: "%Y-%m-%d %H:%M:%S",
            date: { $convert: { input: field, to: "date" } },
          },
        },
        regex: text,
        options: "i",
      },
    },
  };
};
