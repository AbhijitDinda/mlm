import { Box } from "@mui/material";
import { m } from "framer-motion";
import { ReactNode, useContext } from "react";
import { AnimatedContext } from "./Page";

const AnimatedBox = ({
  children,
  ...props
}: {
  children: ReactNode;
  [x: string]: any;
}): JSX.Element => {
  const { variants } = useContext(AnimatedContext);
  return (
    <Box component={m.div} variants={variants} {...props}>
      {children}
    </Box>
  );
};

export default AnimatedBox;
