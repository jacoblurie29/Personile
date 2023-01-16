import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PunchClockIcon from "@mui/icons-material/PunchClock";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Task } from "app/models/task";
import { useAppSelector } from "app/store/configureStore";

interface Props {
  startingState: number;
  task: Task;
  sprintId: string;
  handleChangeState: (
    currentTask: Task,
    currentState: number,
    newState: number,
    sprintId: string,
    oldOrder: number,
    newOrder: number
  ) => void;
}

export default function ViewTaskStateToggleButton({
  task,
  startingState,
  sprintId,
  handleChangeState,
}: Props) {
  // react state
  const [alignment, setAlignment] = useState<string | null>("left");
  const { currentBoard } = useAppSelector((state) => state.sprintView);
  const tasks =
    useAppSelector((state) =>
      state.user.userData?.boards
        .find((b) => b.boardEntityId == currentBoard)
        ?.sprints.find((s) => s.sprintEntityId == sprintId)
    )?.tasks || [];

  // handle toggled button state
  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    setAlignment(newAlignment);
  };

  // not implemented yet. still on the fence.
  function calculateNewOrderValue(newState: number): number {
    if (
      tasks.filter((t) => t.currentState == newState).length == 0 &&
      newState !== 0
    ) {
      return calculateNewOrderValue(newState - 1);
    } else if (tasks.filter((t) => t.currentState == newState).length == 0) {
      return 0;
    }

    var maxTaskOrder = -1;

    tasks
      .filter((t) => t.currentState == newState)
      .forEach((t) => {
        if (t.order > maxTaskOrder) {
          maxTaskOrder = t.order;
        }
      });

    return maxTaskOrder;
  }

  return (
    <ToggleButtonGroup
      sx={{ backgroundColor: "white" }}
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
    >
      <ToggleButton
        sx={{
          "&.Mui-selected, &.Mui-selected:hover": {
            background:
              "linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)",
          },
        }}
        value="new"
        aria-label="left aligned"
        selected={startingState === 0}
        onClick={() =>
          handleChangeState(
            task,
            startingState,
            0,
            sprintId,
            task.order,
            task.order
          )
        }
      >
        <HighlightOffIcon
          sx={{
            color: startingState === 0 ? "background.paper" : "error.main",
          }}
        />
      </ToggleButton>
      <ToggleButton
        sx={{
          "&.Mui-selected, &.Mui-selected:hover": {
            background:
              "linear-gradient(90deg, rgba(255,209,125,1) 0%, rgba(255,196,54,1) 100%)",
          },
        }}
        value="active"
        aria-label="centered"
        selected={startingState === 1}
        onClick={() =>
          handleChangeState(
            task,
            startingState,
            1,
            sprintId,
            task.order,
            task.order
          )
        }
      >
        <PunchClockIcon
          sx={{
            color: startingState === 1 ? "background.paper" : "warning.main",
          }}
        />
      </ToggleButton>
      <ToggleButton
        sx={{
          "&.Mui-selected, &.Mui-selected:hover": {
            background:
              "linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)",
          },
        }}
        value="completed"
        aria-label="right aligned"
        selected={startingState === 2}
        onClick={() =>
          handleChangeState(
            task,
            startingState,
            2,
            sprintId,
            task.order,
            task.order
          )
        }
      >
        <CheckCircleOutlineIcon
          sx={{
            color: startingState === 2 ? "background.paper" : "success.main",
          }}
        />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
