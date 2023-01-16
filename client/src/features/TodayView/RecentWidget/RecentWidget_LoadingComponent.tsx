import { Box, CircularProgress, Typography } from "@mui/material";

export default function RecentWidgetLoadingComponent() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="60%"
    >
      <CircularProgress size={50} sx={{ color: "#21c1b4" }} />
    </Box>
  );
}
