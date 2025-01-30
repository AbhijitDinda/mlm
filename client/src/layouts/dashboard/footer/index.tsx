import { Box, Link, Typography } from "@mui/material";
import useConfiguration from "../../../hooks/useConfiguration";

const index = () => {
  const { appName } = useConfiguration();
  const currentYear = new Date().getFullYear();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        py: 2,
        bgcolor: "background.paper",
        boxShadow: (theme) => theme.customShadows.z24,
        paddingLeft: 5,
        paddingRight: 5,
        flexDirection: {
          xs: "column",
          md: "row",
        },
        gap: 1,
        alignItems: "center",
        textAlign: "center",
      }}
      component="footer"
    >
      <Typography component="div" variant="body2">
        ©{currentYear} - <Link href="https://www.jamsrworld.com">{appName}</Link> All Rights
        Reserved.
      </Typography>
      <Typography component="div" variant="body2">
        Created by <Link href="https://www.jamsrworld.com">jamsrworld.com</Link>
      </Typography>
    </Box>
  );
};

export default index;
