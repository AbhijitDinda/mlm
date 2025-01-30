import { Box, Link, Typography } from "@mui/material";
import AnimatedBox from "./AnimatedBox";
import Breadcrumbs from "./Breadcrumbs";

// ----------------------------------------------------------------------

const isString = (str: any): str is string => typeof str === "string";

interface Props {
  links: { name: string; href?: string }[];
  action?: React.ReactNode;
  heading: string;
  moreLink?: string | string[];
  sx?: Object;
}

export default function HeaderBreadcrumbs({
  links,
  action,
  heading,
  moreLink = "",
  sx = {},
  ...other
}: Props) {
  return (
    <AnimatedBox>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" gutterBottom>
            {heading}
          </Typography>
          <Breadcrumbs links={links} {...other} />
        </Box>

        {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
      </Box>

      <Box sx={{ mt: 2 }}>
        {isString(moreLink) ? (
          <Link href={moreLink} target="_blank" rel="noopener" variant="body2">
            {moreLink}
          </Link>
        ) : (
          moreLink.map((href) => (
            <Link
              noWrap
              key={href}
              href={href}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: "table" }}
            >
              {href}
            </Link>
          ))
        )}
      </Box>
    </AnimatedBox>
  );
}
