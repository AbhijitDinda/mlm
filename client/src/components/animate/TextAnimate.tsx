import { Box } from "@mui/material";
import { m, Variants } from "framer-motion";
import { varFade } from "./variants";

// ----------------------------------------------------------------------

interface Props {
  text: string;
  variants?: Variants;
  sx?: object;
  [x: string]: any;
}

export default function TextAnimate({ text, variants, sx, ...other }: Props) {
  return (
    <Box
      component={m.h1}
      sx={{
        typography: "h1",
        overflow: "hidden",
        display: "inline-flex",
        ...sx,
      }}
      {...other}
    >
      {text.split("").map((letter, index) => (
        <m.span key={index} variants={variants || varFade().inUp}>
          {letter}
        </m.span>
      ))}
    </Box>
  );
}
