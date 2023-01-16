import { Box, Grid, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

interface Props {
  currentState: number;
  title: string;
}

export default function ViewTaskStateDisplay({ currentState, title }: Props) {
  return (
    <Grid container display="flex" flexGrow={1}>
      <Grid item paddingRight="5px" xs={9} display="flex" alignItems="center">
        <Typography sx={{ color: "grey.800", fontSize: "20px", pl: "4%" }}>
          {title}
        </Typography>
      </Grid>
      <Grid
        item
        xs={3}
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
      >
        {currentState === 0 ? (
          <ClearIcon sx={{ fontSize: "35px", color: "error.main" }} />
        ) : currentState === 1 ? (
          <HourglassBottomIcon
            sx={{ fontSize: "35px", color: "warning.main" }}
          />
        ) : (
          <CheckIcon sx={{ fontSize: "35px", color: "success.main" }} />
        )}
      </Grid>
    </Grid>
  );
}
