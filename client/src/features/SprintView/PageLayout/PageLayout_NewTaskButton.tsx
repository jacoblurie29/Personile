import { Box, Grid, Grow, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface Props {
  addNewTaskOnClick: () => void;
  index: number;
}

export default function PageLayoutNewTaskButton({
  addNewTaskOnClick,
  index,
}: Props) {
  return (
    <Grow in={true} timeout={(index + 1) * 500}>
      <Box
        sx={{
          backgroundColor: "rgba(256,256,256,0)",
          border: "1px dashed",
          borderColor: "grey.500",
          borderRadius: "5px",
          "&:hover": { cursor: "pointer" },
        }}
        flexGrow={1}
        onClick={addNewTaskOnClick}
        marginTop="10px"
      >
        <Grid container flexGrow={1} alignItems="center" padding="7px">
          <Grid item xs={6}>
            <Typography
              variant="h4"
              sx={{ color: "grey.500", paddingLeft: "20px" }}
            >
              New Task
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <AddIcon
              sx={{
                float: "right",
                color: "grey.500",
                pr: "10px",
                fontSize: "3em",
              }}
            />
          </Grid>
        </Grid>
      </Box>
    </Grow>
  );
}
