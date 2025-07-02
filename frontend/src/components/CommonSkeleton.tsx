import { Skeleton, SkeletonProps, SxProps } from "@mui/material";
import { colors } from "../constants";

const skeletonCommonStyles: SxProps = {
  borderRadius: 2,
  bgcolor: colors.lightGrey,
};

const CommonSkeleton = ({ height = 47, width = "100%", sx }: SkeletonProps) => (
  <Skeleton
    width={width}
    height={height}
    sx={{ ...skeletonCommonStyles, ...sx }}
    variant="rectangular"
    animation="wave"
  />
);

export default CommonSkeleton;
