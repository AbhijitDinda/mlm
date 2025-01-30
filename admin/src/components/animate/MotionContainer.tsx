import { Box } from "@mui/material";
import { m } from "framer-motion";
import { varContainer } from "./variants";

// ----------------------------------------------------------------------

interface Props {
  [x: string]: any;
  animate: boolean;
  action?: boolean;
  children: React.ReactNode;
}

export default function MotionContainer({
  animate,
  action = false,
  children,
  ...other
}: Props) {
  if (action) {
    return (
      <Box
        component={m.div}
        initial={false}
        animate={animate ? "animate" : "exit"}
        variants={varContainer({})}
        {...other}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={varContainer({})}
      {...other}
    >
      {children}
    </Box>
  );
}
