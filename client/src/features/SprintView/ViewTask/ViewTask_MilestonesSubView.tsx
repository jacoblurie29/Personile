import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import { Task } from "app/models/task";
import { useAppSelector } from "app/store/configureStore";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface Props {
  task: Task;
}

export default function TaskMilestonesSubView({ task }: Props) {
  // redux state
  const { currentBoard } = useAppSelector((state) => state.sprintView);
  const boards = useAppSelector((state) => state.user.userData?.boards);
  const board = boards?.find((b) => b.boardEntityId == currentBoard);

  return (
    <List dense sx={{ width: "100%", borderRadius: "5px" }}>
      {board?.milestones
        .filter((m) => task.milestoneIds.includes(m.milestoneEntityId))
        .map((milestone, index) => (
          <Grid
            key={"taskMilestone" + index}
            item
            xs={12}
            sx={{
              padding: "5px",
              backgroundColor: "primary.light",
              borderRadius:
                task.milestoneIds.length === 1
                  ? "5px"
                  : index === 0
                  ? "5px 5px 0 0"
                  : "0px 0px 5px 5px",
            }}
          >
            <Grid container alignItems="center" padding="2px">
              <Grid item xs={11} height="20px">
                <Typography sx={{ paddingLeft: "10px", color: "grey.900" }}>
                  {milestone.description}
                </Typography>
              </Grid>
              <Grid item xs={1} height="20px">
                {milestone.status === "Incomplete" ? (
                  <HighlightOffIcon
                    sx={{ fontSize: "20px", color: "error.main" }}
                  />
                ) : (
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: "20px", color: "success.main" }}
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        ))}
      {board?.milestones.filter((m) =>
        task.milestoneIds.includes(m.milestoneEntityId)
      ).length === 0 && (
        <ListItem sx={{ backgroundColor: "grey.50", borderRadius: "5px" }}>
          <Box sx={{ marginRight: "5px", textAlign: "center" }} flexGrow={1}>
            <Typography variant="subtitle2" fontSize={"14px"}>
              No milestones for this task.
            </Typography>
          </Box>
        </ListItem>
      )}
    </List>
  );
}
