import { Box, Card, Typography } from "@mui/material";
import { Board } from "app/models/board";
import CurrentWidgetTaskView from "./CurrentWidget_TaskView";

interface Props {
  boards: Board[];
}

export default function CurrentWidgetCard({ boards }: Props) {
  const allInProgressTasks = boards.flatMap((b) =>
    b.sprints.flatMap((s) => s.tasks.filter((t) => t.currentState == 1))
  );

  return (
    <Card
      elevation={0}
      sx={{
        height: "95%",
        width: "95%",
        overflowY: "auto",
        borderRadius: "25px",
        border: "1px solid",
        borderColor: "grey.400",
        padding: "20px",
      }}
    >
      <Typography
        variant="h2"
        sx={{ margin: "10px 0px 5px 10px", color: "grey.600" }}
      >
        In Progress Tasks
      </Typography>
      <Box sx={{ overflowY: "auto", maxHeight: "75%" }}>
        {allInProgressTasks.map((task, index) => (
          <CurrentWidgetTaskView
            task={task}
            index={index}
            key={index}
            max={allInProgressTasks.length - 1}
            boardTitle={
              boards.find(
                (b) =>
                  b.sprints.find(
                    (s) =>
                      s.tasks.find(
                        (t) => t.taskEntityId == task.taskEntityId
                      ) !== undefined
                  ) !== undefined
              )?.name || ""
            }
            boardId={
              boards.find(
                (b) =>
                  b.sprints.find(
                    (s) =>
                      s.tasks.find(
                        (t) => t.taskEntityId == task.taskEntityId
                      ) != undefined
                  ) !== undefined
              )?.boardEntityId || ""
            }
            sprintId={
              boards
                .find(
                  (b) =>
                    b.sprints.find(
                      (s) =>
                        s.tasks.find(
                          (t) => t.taskEntityId == task.taskEntityId
                        ) != undefined
                    ) !== undefined
                )
                ?.sprints.find(
                  (s) =>
                    s.tasks.find((t) => t.taskEntityId == task.taskEntityId) !=
                    undefined
                )?.sprintEntityId || ""
            }
          />
        ))}
      </Box>
      <Typography
        textAlign={"center"}
        variant="subtitle2"
        sx={{ fontSize: "12px", paddingTop: "10px" }}
      >
        {"Current tasks: " + allInProgressTasks.length}
      </Typography>
    </Card>
  );
}
