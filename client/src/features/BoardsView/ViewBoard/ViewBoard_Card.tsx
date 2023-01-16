import {
  Box,
  Card,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup,
  Zoom,
  Typography,
} from "@mui/material";
import { Board } from "app/models/board";
import TimerIcon from "@mui/icons-material/Timer";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { LoadingButton } from "@mui/lab";
import EditIcon from "@mui/icons-material/Edit";
import LaunchIcon from "@mui/icons-material/Launch";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import {
  setCurrentBoard,
  setCurrentSprint,
} from "features/SprintView/Redux/sprintSlice";
import { useHistory } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import { formatDateString } from "app/util/dateUtil";

interface Props {
  board: Board;
  setNewBoardState: (value: boolean, board: Board) => void;
  indexForAnimation: number;
  animationBoolean: boolean;
}

export default function ViewBoardCard({
  board,
  setNewBoardState,
  indexForAnimation,
  animationBoolean,
}: Props) {
  // redux
  const history = useHistory();
  const boards = useAppSelector((state) => state.user.userData?.boards);
  const dispatch = useAppDispatch();

  // open the sprint view of a board
  const handleOpenBoard = (boardId: string) => {
    // set redux value of current board
    dispatch(setCurrentBoard(boardId));

    // find sprints of board and undefined check
    var currentBoardSprints = boards?.find(
      (b) => b.boardEntityId === boardId
    )?.sprints;
    if (currentBoardSprints === undefined) return;

    // find the first sprint to be opened to
    var setSprint =
      currentBoardSprints.find((s) => {
        return (
          Date.parse(s.startDate || "") <=
            Date.parse(new Date().toString() + 86396400) &&
          Date.parse(s.endDate || "") >=
            Date.parse(new Date().toString()) - 86396400
        );
      })?.sprintEntityId || currentBoardSprints[0].sprintEntityId;

    // set the current sprint
    dispatch(setCurrentSprint(setSprint));

    // change location to sprint view
    history.push("/sprint");
  };

  return (
    <Zoom
      in={animationBoolean}
      timeout={(indexForAnimation + 1) * 300}
      key={"boardCard-" + indexForAnimation}
    >
      <Card
        elevation={0}
        sx={{
          width: "90%",
          margin: "auto",
          height: "400px",
          padding: "10px",
          borderRadius: "25px",
          border: "1px solid",
          borderColor: "grey.400",
          ":hover": { backgroundColor: "grey.50", cursor: "pointer" },
        }}
        onClick={(event) => {
          event.stopPropagation();
          handleOpenBoard(board.boardEntityId);
        }}
      >
        <Grid container height="60px">
          <Grid item xs={8}>
            <Typography
              variant="h2"
              sx={{ paddingTop: "20px", paddingLeft: "20px" }}
            >
              {board.name}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Grid
              container
              width="fit-content"
              spacing={1}
              paddingTop="10px"
              margin="auto"
              flexGrow={1}
            >
              <Grid
                xs={4}
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  height="30px"
                  width="30px"
                  borderRadius="30px"
                  sx={{ backgroundColor: "error.light" }}
                >
                  <Typography
                    variant="h5"
                    color="background.paper"
                    textAlign="center"
                    paddingTop="20%"
                  >
                    {board.sprints
                      ?.flatMap((s) => s.tasks)
                      .filter((t) => t.currentState === 0).length || "0"}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                xs={4}
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  height="30px"
                  width="30px"
                  borderRadius="30px"
                  sx={{ backgroundColor: "warning.light" }}
                  textAlign="center"
                >
                  <Typography
                    variant="h5"
                    color="background.paper"
                    textAlign="center"
                    paddingTop="20%"
                  >
                    {board.sprints
                      ?.flatMap((s) => s.tasks)
                      .filter((t) => t.currentState === 1).length || "0"}
                  </Typography>
                </Box>
              </Grid>
              <Grid
                xs={4}
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  height="30px"
                  width="30px"
                  borderRadius="30px"
                  sx={{ backgroundColor: "success.light" }}
                >
                  <Typography
                    variant="h5"
                    color="background.paper"
                    textAlign="center"
                    paddingTop="20%"
                  >
                    {board.sprints
                      ?.flatMap((s) => s.tasks)
                      .filter((t) => t.currentState === 2).length || "0"}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Typography variant="h5" sx={{ paddingLeft: "20px" }}>
          {board.description}
        </Typography>
        <Divider sx={{ margin: "5px 0px" }} />
        <Box sx={{ overflowY: "auto", maxHeight: "240px" }}>
          <Typography
            variant="h5"
            sx={{ paddingLeft: "20px", paddingBottom: "5px" }}
          >
            Goals:
          </Typography>
          <List
            dense={true}
            disablePadding={true}
            sx={{
              paddingBottom: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
              height: "100px",
            }}
          >
            {board.goals.length > 0 ? (
              board.goals.map((goal, index) => (
                <ListItem
                  key={"listItem-" + index}
                  sx={{ padding: "0px 0px 0px 20px" }}
                >
                  <ListItemText>
                    <CircleIcon
                      sx={{
                        color: "grey.600",
                        fontSize: "7px",
                        marginRight: "4px",
                      }}
                    />
                    {goal.details}
                  </ListItemText>
                </ListItem>
              ))
            ) : (
              <Box flexGrow={1} height="100%" textAlign="center" margin="auto">
                <Typography
                  variant="h5"
                  sx={{ color: "grey.400", paddingTop: "25px" }}
                >
                  &#40;No goals&#41;
                </Typography>
              </Box>
            )}
          </List>
          <Divider />
          <br />
          <Typography variant="h5" sx={{ paddingLeft: "20px" }}>
            Milestones:
          </Typography>
          <List
            dense={true}
            disablePadding={true}
            sx={{
              paddingBottom: "10px",
              paddingLeft: "10px",
              paddingRight: "10px",
              height: "100px",
            }}
          >
            {board.milestones.length > 0 ? (
              board.milestones.map((milestone, index) => (
                <ListItem key={"listItem-" + index} sx={{ width: "100%" }}>
                  <Typography
                    variant="body2"
                    sx={{ display: "flex", marginRight: "10px" }}
                  >
                    {milestone.status === "Incomplete" ? (
                      <TimerIcon sx={{ color: "warning.dark" }} />
                    ) : (
                      <CheckCircleIcon sx={{ color: "success.main" }} />
                    )}
                  </Typography>
                  <Typography variant="body2" sx={{ display: "flex" }}>
                    {milestone.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    marginLeft="auto"
                    marginRight="10px"
                    noWrap
                  >
                    {milestone.dueDate !== ""
                      ? (milestone.hardDeadline === true
                          ? "Deadline: "
                          : "Goal: ") + formatDateString(milestone.dueDate)
                      : "No Goal"}
                  </Typography>
                </ListItem>
              ))
            ) : (
              <Box flexGrow={1} height="100%" textAlign="center" margin="auto">
                <Typography
                  variant="h5"
                  sx={{ color: "grey.400", paddingTop: "25px" }}
                >
                  &#40;No milestones&#41;
                </Typography>
              </Box>
            )}
          </List>
        </Box>
        <Box sx={{ flexGrow: 1, textAlign: "right" }}>
          <LoadingButton
            key={"edit-" + board.boardEntityId}
            variant="contained"
            sx={{
              backgroundColor: "grey.400",
              borderRadius: "25px",
              width: "50px",
              marginRight: "10px",
            }}
            onClick={(event) => {
              setNewBoardState(true, board);
              event.stopPropagation();
            }}
          >
            <EditIcon sx={{ color: "background.paper" }} />
          </LoadingButton>
        </Box>
      </Card>
    </Zoom>
  );
}
