import {
  alpha,
  Card,
  CardContent,
  Grid,
  styled,
  Tooltip,
  Typography,
} from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import AnimatedBox from "../../components/AnimatedBox";
import Iconify from "../../components/Iconify";
import { PaletteBasicColor } from "../../theme";
import { fShortenNumber } from "../../utils/formatNumber";

const StyledCard = styled(Card)<{ color: PaletteBasicColor }>(
  ({ theme, color }) => ({
    background: theme.palette[color].lighter,
    color: theme.palette[color].darker,
  })
);

const IconWrapperStyle = styled("div")(({ theme }) => ({
  margin: "auto",
  display: "flex",
  borderRadius: "50%",
  alignItems: "center",
  width: theme.spacing(12),
  height: theme.spacing(12),
  justifyContent: "center",
  marginBottom: theme.spacing(3),
}));

export const InfoCard = ({
  label,
  value = 0,
  icon,
  color = "primary",
  format,
  rotate = 0,
  loading,
  formatValue = true,
}: {
  label: string;
  value?: number;
  icon: string;
  color?: PaletteBasicColor;
  format?: (value: number) => string;
  rotate?: number;
  loading: boolean;
  formatValue?: boolean;
}) => {
  const originalValue = value;
  let fValue: string | number = value;
  if (formatValue) {
    fValue = fShortenNumber(value);
    if (format) fValue = format(value);
  }

  return (
    <Grid item xs={12} md={4} xl={3}>
      <AnimatedBox>
        <StyledCard color={color}>
          <CardContent>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
              sx={{ background: "" }}
            >
              <Stack spacing={1} sx={{ flex: 1 }}>
                <Tooltip title={originalValue}>
                  <Typography component="div" variant="h5">
                    {loading ? (
                      <Skeleton
                        sx={{
                          bgcolor: (theme) =>
                            alpha(theme.palette[color].main, 0.1),
                        }}
                      />
                    ) : (
                      fValue
                    )}
                  </Typography>
                </Tooltip>
                <Typography
                  sx={{ opacity: 0.72 }}
                  component="div"
                  variant="subtitle2"
                >
                  {loading ? (
                    <Skeleton
                      sx={{
                        bgcolor: (theme) =>
                          alpha(theme.palette[color].main, 0.1),
                      }}
                    />
                  ) : (
                    label
                  )}
                </Typography>
              </Stack>
              {loading ? (
                <Skeleton
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette[color].main, 0.1),
                  }}
                  variant="circular"
                  width={96}
                  height={96}
                />
              ) : (
                <IconWrapperStyle
                  sx={{
                    color: (theme) => theme.palette[color].dark,
                    backgroundImage: (theme) =>
                      `linear-gradient(135deg, ${alpha(
                        theme.palette[color].dark,
                        0
                      )} 0%, ${alpha(theme.palette[color].dark, 0.24)} 100%)`,
                  }}
                >
                  <Iconify
                    sx={{ opacity: 0.72 }}
                    icon={icon}
                    width={50}
                    height={50}
                    rotate={rotate}
                  />
                </IconWrapperStyle>
              )}
            </Stack>
          </CardContent>
        </StyledCard>
      </AnimatedBox>
    </Grid>
  );
};
