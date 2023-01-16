import { Box, Card, Grid, IconButton, Typography } from "@mui/material";
import { Task } from "app/models/task";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { changeTaskFocusedAsync } from "app/state/userSlice";
import { Board } from "app/models/board";

interface Props {
  task: Task;
  boards: Board[];
  index: number;
  max: number;
  boardTitle: string;
  isLeftSide: boolean;
}

export default function TodayWidgetTaskView({
  task,
  index,
  max,
  boardTitle,
  isLeftSide,
  boards,
}: Props) {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.user.userData?.userEntityId);

  // invert colors on state selected
  const boxStyles = {
    background:
      task.currentState === 0
        ? "linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)"
        : task.currentState === 1
        ? "linear-gradient(90deg, rgba(255,209,125,1) 0%, rgba(255,196,54,1) 100%)"
        : "linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)",
    borderRadius: "8px",
    padding: "7px",
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

  const handleMoveTask = () => {
    var boardId =
      boards.find(
        (b) =>
          b.sprints.find(
            (s) =>
              s.tasks.find((t) => t.taskEntityId == task.taskEntityId) !=
              undefined
          ) !== undefined
      )?.boardEntityId || "";
    var sprintId =
      boards
        .find(
          (b) =>
            b.sprints.find(
              (s) =>
                s.tasks.find((t) => t.taskEntityId == task.taskEntityId) !=
                undefined
            ) !== undefined
        )
        ?.sprints.find(
          (s) =>
            s.tasks.find((t) => t.taskEntityId == task.taskEntityId) !=
            undefined
        )?.sprintEntityId || "";

    if (userId == undefined || boardId == undefined || sprintId == undefined)
      return;

    dispatch(
      changeTaskFocusedAsync({
        userId: userId,
        boardId: boardId,
        sprintId: sprintId,
        taskId: task.taskEntityId,
      })
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
        {!isLeftSide && (
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
              onClick={() => handleMoveTask()}
            >
              <ArrowBackIcon sx={{ fontSize: "22px", color: "grey.50" }} />
            </IconButton>
          </Grid>
        )}
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
            {task.currentState === 0 ? (
              <HighlightOffIcon sx={{ fontSize: "25px", color: "grey.50" }} />
            ) : task.currentState === 1 ? (
              <PunchClockIcon sx={{ fontSize: "25px", color: "grey.50" }} />
            ) : (
              <CheckCircleOutlineIcon
                sx={{ fontSize: "25px", color: "grey.50" }}
              />
            )}
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
            {task.name}
          </Typography>
          {boardTitle != "" && (
            <Typography
              variant="subtitle2"
              sx={{ margin: "0px 15px", fontSize: "12px" }}
            >
              {"Board: " + boardTitle}
            </Typography>
          )}
        </Grid>
        {isLeftSide && (
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
              onClick={() => handleMoveTask()}
            >
              <ArrowForwardIcon sx={{ fontSize: "22px", color: "grey.50" }} />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Card>
  );
}
