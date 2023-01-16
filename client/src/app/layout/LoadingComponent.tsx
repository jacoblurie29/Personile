import { Backdrop, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";

interface Props {
  message?: string;
}

export default function LoadingComponent({ message = "Loading..." }: Props) {
  return (
    <Backdrop open={true} invisible={true}>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress size={50} sx={{ color: "#21c1b4" }} />
        <Typography
          variant="h5"
          sx={{
            justifyContent: "center",
            position: "fixed",
            top: "55%",
            color: "white",
          }}
        >
          {message}
        </Typography>
      </Box>
    </Backdrop>
  );
}
