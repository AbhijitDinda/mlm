import { Box } from "@mui/material";
import { m } from "framer-motion";
import { varContainer } from ".";
import useResponsive from "../../hooks/useResponsive";

// ----------------------------------------------------------------------
interface Props {
  children: React.ReactNode;
  disableAnimatedMobile: boolean;
  [x: string]: any;
}
export default function MotionViewport({
  children,
  disableAnimatedMobile = true,
  ...other
}: Props) {
  const isDesktop = useResponsive("up", "sm");

  if (!isDesktop && disableAnimatedMobile) {
    return <Box {...other}>{children}</Box>;
  }

  return (
    <Box
      component={m.div}
      initial="initial"
      whileInView="animate"
      viewport={{ amount: "some" }}
      variants={varContainer()}
      {...other}
    >
      {children}
    </Box>
  );
}
