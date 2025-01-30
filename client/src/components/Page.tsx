import { Box, SxProps } from "@mui/material";
import { ReactNode, createContext, forwardRef, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import useConfiguration from "../hooks/useConfiguration";
import { getFileSrc } from "../utils/fns";
import { MotionViewport, varFade, varSlide } from "./animate";

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode;
  title: string;
  animate?: boolean;
  meta?: React.ReactNode;
  sx?: SxProps;
}

export const AnimatedContext = createContext<{
  variants: any;
}>({
  variants: null,
});

const animations = [
  varFade().inLeft,
  varFade().inRight,
  varFade().inDown,
  varFade().in,
  varSlide().inDown,
  varSlide().inRight,
  varSlide().inLeft,
  varSlide().inUp,
];

export function AnimatedProvider({
  children,
  sx,
  variants,
}: {
  children: ReactNode;
  sx?: SxProps;
  variants?: any;
}) {

  const framerVariants = useMemo(
    () =>
      variants
        ? variants
        : animations[Math.floor(Math.random() * animations.length)],
    []
  );

  return (
    // @ts-ignore
    <AnimatedContext.Provider value={{ variants: framerVariants }}>
      <Box sx={{ width: 1, flexGrow: 1, ...sx }} component={MotionViewport}>
        {children}
      </Box>
    </AnimatedContext.Provider>
  );
}

const Page: React.FC<Props> = forwardRef(
  ({ children, title = "", meta, sx, animate = true, ...other }, ref) => {
    const { appName, favicon } = useConfiguration();
    return (
      <>
        <Helmet>
          <title>{`${title} | ${appName}`}</title>
          <link rel="icon" type="image/x-icon" href={getFileSrc(favicon)} />
          {meta}
        </Helmet>

        {animate ? (
          <Box sx={{ width: 1, flexGrow: 1, ...sx }} ref={ref} {...other}>
            <AnimatedProvider sx={sx}>{children}</AnimatedProvider>
          </Box>
        ) : (
          <Box sx={{ width: 1, flexGrow: 1, ...sx }} ref={ref} {...other}>
            {children}
          </Box>
        )}
      </>
    );
  }
);

export default Page;
