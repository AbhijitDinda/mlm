import {
  IconButton,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { AnimatePresence, m } from "framer-motion";
import { fData } from "../../utils/formatNumber";
import Iconify from "../Iconify";
import Image from "../Image";
import { varFade } from "../animate";
import { isString } from "./UploadAvatar";

// ----------------------------------------------------------------------

const getFileData = (
  file:
    | string
    | {
        name: string;
        size: number;
        preview: string;
        progress: number;
        upload: boolean;
      }
) => {
  if (typeof file === "string") {
    return {
      key: file,
    };
  }
  return {
    key: file.name,
    name: file.name,
    size: file.size,
    preview: file.preview,
    progress: file.progress,
    upload: file.upload,
  };
};

// ----------------------------------------------------------------------

interface Props {
  files?: string[];
  showPreview?: boolean;
  onRemove?: (file: string) => void;
}

export default function MultiFilePreview({
  showPreview = false,
  files = [],
  onRemove = (file: string) => {},
}: Props) {
  const hasFile = files.length > 0;

  return (
    <>
      <List disablePadding sx={{ ...(hasFile && { my: 3 }) }}>
        <AnimatePresence>
          {files &&
            files.map((file) => {
              const { key, name, size, preview, progress, upload } =
                getFileData(file);

              if (showPreview) {
                return (
                  <ListItem
                    key={key}
                    component={m.div}
                    {...varFade().inRight}
                    sx={{
                      p: 0,
                      m: 0.5,
                      width: 80,
                      height: 80,
                      borderRadius: 1.25,
                      overflow: "hidden",
                      position: "relative",
                      display: "inline-flex",
                      border: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <Image
                      alt="preview"
                      src={isString(file) ? file : preview!}
                      ratio="1/1"
                    />

                    {upload === false || (
                      <IconButton
                        size="small"
                        onClick={() => onRemove(file)}
                        sx={{
                          top: 6,
                          p: "2px",
                          right: 6,
                          position: "absolute",
                          color: "common.white",
                          bgcolor: (theme) =>
                            alpha(theme.palette.grey[900], 0.72),
                          "&:hover": {
                            bgcolor: (theme) =>
                              alpha(theme.palette.grey[900], 0.48),
                          },
                        }}
                      >
                        <Iconify icon={"eva:close-fill"} />
                      </IconButton>
                    )}
                  </ListItem>
                );
              }

              return (
                <ListItem
                  key={key}
                  component={m.div}
                  {...varFade().inRight}
                  sx={{
                    my: 1,
                    px: 2,
                    py: 0.75,
                    borderRadius: 0.75,
                    border: (theme) => `solid 1px ${theme.palette.divider}`,
                  }}
                >
                  <Iconify
                    icon={"eva:file-fill"}
                    sx={{
                      width: 28,
                      height: 28,
                      color: "text.secondary",
                      mr: 2,
                    }}
                  />

                  <ListItemText
                    primary={isString(file) ? file : name}
                    secondary={isString(file) ? "" : fData(size || 0)}
                    primaryTypographyProps={{ variant: "subtitle2" }}
                    secondaryTypographyProps={{ variant: "caption" }}
                  />

                  <IconButton
                    edge="end"
                    size="small"
                    onClick={() => onRemove(file)}
                  >
                    <Iconify icon={"eva:close-fill"} />
                  </IconButton>
                </ListItem>
              );
            })}
        </AnimatePresence>
      </List>
    </>
  );
}
