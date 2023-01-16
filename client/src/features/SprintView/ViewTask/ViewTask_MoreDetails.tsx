import {
  Grid,
  Typography,
  Chip,
  LinearProgress,
  linearProgressClasses,
  styled,
  Tooltip,
  Box,
  Collapse,
  IconButton,
} from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import ViewTaskSubtaskSubView from "./ViewTask_SubtaskSubView";
import TaskMilestonesSubView from "./ViewTask_MilestonesSubView";
import { Task } from "app/models/task";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { useState } from "react";

interface Props {
  focusedTask: Task;
}

// effort slider object and styles
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundImage:
      "linear-gradient(to right, #0fe21f, #6ee11a, #99e023, #bade34, #d4dd47, #e4d346, #f1c84a, #fbbe51, #ffa74c, #ff8f4e, #ff7755, #fb5f5f)",
  },
}));

export default function ViewTaskMoreDetails({ focusedTask }: Props) {
  // redux state
  const { currentBoard } = useAppSelector((state) => state.sprintView);
  const boards = useAppSelector((state) => state.user.userData?.boards);
  const board = boards?.find((b) => b.boardEntityId == currentBoard);

  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Box paddingBottom="10px">
      <Collapse in={expanded}>
        {focusedTask.tags !== "" && (
          <>
            <Typography variant="caption" sx={{ color: "grey.600" }}>
              Tags&nbsp;(
              {focusedTask.tags !== "" ? focusedTask.tags.split("|").length : 0}
              )
            </Typography>
            <Grid
              container
              padding="10px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px solid #ECECEC"
              sx={{ borderRadius: "5px", mb: "5px" }}
            >
              <Grid item justifyContent="center" sx={{ margin: "auto" }}>
                {focusedTask?.tags.split("|").map((tag, index) => (
                  <Chip
                    size={"small"}
                    key={tag}
                    label={tag}
                    sx={{
                      margin: "2px",
                      padding: "0px",
                      backgroundColor: "primary.light",
                      fontSize: "11px",
                    }}
                  />
                ))}
              </Grid>
            </Grid>
          </>
        )}
        {focusedTask.links !== "" && (
          <Box sx={{ paddingBottom: "5px" }}>
            <Typography variant="caption" sx={{ color: "grey.600" }}>
              Links&nbsp;(
              {focusedTask.links !== ""
                ? focusedTask.links.split("|").length
                : 0}
              )
            </Typography>
            <Grid
              container
              padding="10px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px solid #ECECEC"
              sx={{ borderRadius: "5px", mb: "5px" }}
            >
              <Grid item justifyContent="center" sx={{ margin: "auto" }}>
                {focusedTask?.links.split("|").map((tag, index) => (
                  <Chip
                    size={"small"}
                    key={tag}
                    label={tag}
                    onClick={() => window.open(tag, "_blank")}
                    sx={{
                      margin: "2px",
                      padding: "0px",
                      backgroundColor: "primary.light",
                      fontSize: "11px",
                    }}
                  />
                ))}
              </Grid>
            </Grid>
          </Box>
        )}
        {focusedTask.milestoneIds !== "" && (
          <>
            <Typography variant="caption" sx={{ color: "grey.600" }}>
              Milestones&nbsp;(
              {focusedTask.milestoneIds === ""
                ? "0"
                : focusedTask.milestoneIds.split("|").length}
              )
            </Typography>
            <TaskMilestonesSubView task={focusedTask} />
          </>
        )}
        <Typography variant="caption" sx={{ color: "grey.600" }}>
          Estimated effort
        </Typography>
        <Tooltip title={focusedTask.effort} arrow>
          <BorderLinearProgress
            sx={{ mt: "2px", mb: "12px", boxShadow: "1px 2px 7px #777777" }}
            variant="determinate"
            value={focusedTask.effort * 10}
          />
        </Tooltip>
      </Collapse>
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"end"}
        sx={{
          ":hover": { backgroundColor: "grey.50", cursor: "pointer" },
          borderRadius: "5px",
        }}
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {expanded ? (
          <ArrowDropUpIcon sx={{ color: "grey.400" }} />
        ) : (
          <ArrowDropDownIcon sx={{ color: "grey.400" }} />
        )}
        <Typography sx={{ padding: "0px" }} variant="caption">
          Tags, Links, Effort, Milestones
        </Typography>
        {expanded ? (
          <ArrowDropUpIcon sx={{ color: "grey.400" }} />
        ) : (
          <ArrowDropDownIcon sx={{ color: "grey.400" }} />
        )}
      </Box>
      <Typography variant="caption" sx={{ color: "grey.600" }}>
        Subtasks&nbsp;({focusedTask.subTasks.length})
      </Typography>
      <ViewTaskSubtaskSubView task={focusedTask} isDialog={true} />
    </Box>
  );
}

/*
<Grid container paddingTop='10px' display='flex'>
    <Grid item xs={6}>
        {focusedTask?.dueDate &&
            <Typography variant="body1" sx={{flexGrow: 1, textAlign: 'right', verticalAlign: "middle", mr: '20px'}}>
                Due date:&nbsp;
                { 
                new Date(focusedTask?.dueDate).toLocaleDateString()
                }
            </Typography>                                
        }
    </Grid>
</Grid>
*/
