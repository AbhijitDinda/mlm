import { Box, Link } from "@mui/material";
import { ReactNode } from "react";
import { Effect, LazyLoadImage } from "react-lazy-load-image-component";
import fileImage from "../assets/icons/file.webp";
import ImagePlaceholder from "../assets/images/img_placeholder.svg";
import { getFileSrc } from "../utils/fns";

// ----------------------------------------------------------------------

const RatioArr = [
  "4/3",
  "3/4",
  "6/4",
  "4/6",
  "16/9",
  "9/16",
  "21/9",
  "9/21",
  "1/1",
] as const;
type Ratio = typeof RatioArr[number];

export const getFileExt = (url: string) => {
  const ext = url?.split(".").pop() ?? "";
  return ext;
};

export const isImageUrl = (url: string) => {
  const ext = getFileExt(url);
  const images = ["png", "jpg", "webp", "jpeg", "svg"];
  return images.includes(ext);
};

const setFileUrl = (url: string) => {
  if (!url || isImageUrl(url)) return url;
  return fileImage;
};

const ImageWithFile = ({
  originalSrc,
  isImage,
  children,
  openUrl,
  isLocal,
}: {
  originalSrc: string;
  isImage: boolean;
  children: ReactNode;
  openUrl?: boolean;
  isLocal: boolean;
}) => {
  if (openUrl || (!isImage && !isLocal)) {
    return (
      <Link
        target="_blank"
        sx={{ display: "flex", flex: 1 }}
        href={originalSrc}
      >
        {children}
      </Link>
    );
  } else return <>{children}</>;
};

interface Props {
  ratio?: Ratio;
  isLocal?: boolean;
  cover?: boolean;
  visibleByDefault?: boolean;
  disabledEffect?: boolean;
  effect?: Effect;
  src: string;
  alt?: string;
  sx?: object;
  openUrl?: boolean;
}
export default function Image({
  ratio,
  isLocal = false,
  disabledEffect = false,
  effect = "blur",
  src,
  sx,
  alt,
  openUrl,
  cover = true,
  ...other
}: Props) {
  const isImage = isImageUrl(src);
  if (!isLocal) src = getFileSrc(src);
  const originalSrc = src;
  if (!isLocal) src = setFileUrl(src);

  if (ratio) {
    return (
      <ImageWithFile
        isLocal={isLocal}
        openUrl={openUrl}
        originalSrc={originalSrc}
        isImage={isImage}
      >
        <Box
          component="span"
          sx={{
            width: 1,
            lineHeight: 0,
            display: "block",
            overflow: "hidden",
            position: "relative",
            pt: getRatio(ratio),
            "& .wrapper": {
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              lineHeight: 0,
              position: "absolute",
              backgroundSize: "cover !important",
            },
            ...sx,
          }}
        >
          <Box
            src={src}
            component={LazyLoadImage}
            wrapperClassName="wrapper"
            effect={disabledEffect ? undefined : effect}
            placeholderSrc={ImagePlaceholder}
            sx={{ width: 1, height: 1, objectFit: "cover" }}
            {...other}
          />
        </Box>
      </ImageWithFile>
    );
  }

  return (
    <ImageWithFile
      isLocal={isLocal}
      originalSrc={originalSrc}
      isImage={isImage}
    >
      <Box
        component="span"
        sx={{
          lineHeight: 0,
          display: "block",
          overflow: "hidden",
          "& .wrapper": {
            width: 1,
            height: 1,
            backgroundSize: "cover !important",
          },
          ...sx,
        }}
      >
        <Box
          component={LazyLoadImage}
          wrapperClassName="wrapper"
          effect={disabledEffect ? undefined : effect}
          placeholderSrc={ImagePlaceholder}
          src={src}
          sx={cover ? { width: 1, height: 1, objectFit: "cover" } : {}}
          {...other}
        />
      </Box>
    </ImageWithFile>
  );
}

// ----------------------------------------------------------------------

function getRatio(ratio = "1/1") {
  return {
    "4/3": "calc(100% / 4 * 3)",
    "3/4": "calc(100% / 3 * 4)",
    "6/4": "calc(100% / 6 * 4)",
    "4/6": "calc(100% / 4 * 6)",
    "16/9": "calc(100% / 16 * 9)",
    "9/16": "calc(100% / 9 * 16)",
    "21/9": "calc(100% / 21 * 9)",
    "9/21": "calc(100% / 9 * 21)",
    "1/1": "100%",
  }[ratio];
}
