import { Typography } from "@mui/material";
import reactStringReplace from "react-string-replace";

const TitleText = ({
  text,
  ...otherProps
}: {
  text: string | React.ReactNode[];
}) => {
  text = reactStringReplace(text, /{{(.*?)}}/, (match, i) => {
    return (
      <Typography
        key={match + i}
        sx={{
          color: "primary.main",
          borderBottom: "0.15em solid",
          fontSize: "inherit",
          fontWeight: "inherit",
        }}
        component={"span"}
        {...otherProps}
      >
        {match}
      </Typography>
    );
  });

  text = reactStringReplace(text, /\[\[(.*?)\]\]/, (match, i) => {
    return (
      <Typography
        key={match + i}
        sx={{
          color: "primary.main",
          fontSize: "inherit",
          fontWeight: "inherit",
        }}
        component={"span"}
        {...otherProps}
      >
        {match}
      </Typography>
    );
  });

  return text as any as JSX.Element;
};
export default TitleText;
