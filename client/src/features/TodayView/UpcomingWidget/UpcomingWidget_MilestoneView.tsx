import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { Task } from "app/models/task";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import {
  setCurrentBoard,
  setCurrentSprint,
  setLoading,
} from "features/SprintView/Redux/sprintSlice";
import { useHistory } from "react-router-dom";
import { useAppDispatch } from "app/store/configureStore";
import { fetchCurrentUserAsync } from "app/state/userSlice";
import { Milestone } from "app/models/milestone";
import { convertDateToMilliseconds } from "app/util/dateUtil";

interface Props {
  milestone: Milestone;
  index: number;
  max: number;
  sprintId: string;
  boardId: string;
  boardTitle: string;
}

export default function UpcomingWidgetMilestoneView({
  milestone,
  index,
  max,
  boardTitle,
  boardId,
  sprintId,
}: Props) {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const theme = useTheme();

  // invert colors on state selected
  const boxStyles = {
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    borderRadius: "8px",
    padding: "6px",
  };

  const calculateBorderRadius = (index: number) => {
    if (index == 0) {
      return "5px 5px 0px 0px";
    } else if (index == max) {
      return "0px 0px 5px 5px";
    } else {
      return "0px";
    }
  };

  const handleOpenMilestone = (milestoneId: string) => {
    if (milestoneId == "" || boardId == "" || sprintId == "") return;

    dispatch(setCurrentSprint(sprintId));
    dispatch(setCurrentBoard(boardId));

    history.push("/sprint");
  };

  const calculateOverdue = (dueDate: string) => {
    return (
      convertDateToMilliseconds(dueDate) -
        convertDateToMilliseconds(new Date().toDateString()) <
      0
    );
  };

  return (
    <Card
      elevation={1}
      sx={{
        width: "92%",
        border: "0.01px solid",
        borderColor: "grey.400",
        margin: "0px 10px",
        borderRadius: calculateBorderRadius(index),
      }}
    >
      <Grid container display="flex" flexGrow={1} sx={{ padding: "5px" }}>
        <Grid
          item
          xs={1}
          display="flex"
          alignItems="center"
          justifyContent="flex-middle"
        >
          <Box
            sx={boxStyles}
            display="flex"
            alignItems="center"
            flexDirection="column"
          >
            <Typography sx={{ fontSize: "20px", color: "grey.50" }}>
              &nbsp;M&nbsp;
            </Typography>
          </Box>
        </Grid>
        <Grid
          item
          padding="5px 5px"
          xs={9}
          alignItems="center"
          textAlign={"left"}
        >
          <Typography
            variant="body1"
            sx={{ margin: "0px 15px", fontSize: "15px" }}
          >
            {milestone.description}
          </Typography>
          {boardTitle != "" && (
            <Typography
              variant="subtitle2"
              sx={{ margin: "0px 15px", fontSize: "12px" }}
            >
              {"Board: " + boardTitle}
            </Typography>
          )}
          {calculateOverdue(milestone.dueDate) ? (
            <Typography
              variant="subtitle2"
              sx={{ margin: "0px 15px", fontSize: "12px", color: "#e43329" }}
            >
              {"Past due: " + milestone.dueDate}
            </Typography>
          ) : (
            <Typography
              variant="subtitle2"
              sx={{ margin: "0px 15px", fontSize: "12px" }}
            >
              {"Due date: " + milestone.dueDate}
            </Typography>
          )}
        </Grid>
        <Grid
          item
          xs={2}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          paddingRight="10px"
        >
          <IconButton
            sx={{
              backgroundColor: "grey.400",
              width: "fit-content",
              borderRadius: "8px",
              padding: "6px",
              alignItems: "center",
              flexDirection: "column",
              ":hover": {
                backgroundColor: "grey.500",
              },
            }}
            onClick={() => handleOpenMilestone(milestone.milestoneEntityId)}
          >
            <OpenInNewIcon sx={{ fontSize: "22px", color: "grey.50" }} />
          </IconButton>
        </Grid>
      </Grid>
    </Card>
  );
}
