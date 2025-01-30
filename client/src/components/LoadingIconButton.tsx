import { CircularProgress, IconButton } from "@mui/material";

interface Props {
  loading: boolean;
  children: React.ReactNode;
  [x: string]: any;
}

const LoadingIconButton = ({ loading, children, ...others }: Props) => {
  return (
    <IconButton disabled={loading} {...others}>
      {loading ? <CircularProgress size={24} /> : children}
    </IconButton>
  );
};

export default LoadingIconButton;
