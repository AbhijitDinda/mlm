import { Box } from "@mui/material";
import { forwardRef } from "react";
import { Helmet } from "react-helmet-async";
import useConfiguration from "../hooks/useConfiguration";
import { getFileSrc } from "../utils/fns";

// ----------------------------------------------------------------------

interface Props {
  children: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  sx?: Object;
}

const Page: React.FC<Props> = forwardRef(
  ({ children, title = "", meta, sx, ...other }, ref) => {
    const { appName, favicon } = useConfiguration();
    return (
      <>
        <Helmet>
          <title>{`${title} | ${appName}`}</title>
          <link rel="icon" type="image/x-icon" href={getFileSrc(favicon)} />
          {meta}
        </Helmet>

        <Box sx={{ width: 1, flexGrow: 1, ...sx }} ref={ref} {...other}>
          {children}
        </Box>
      </>
    );
  }
);

export default Page;
