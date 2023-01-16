import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../../../app/store/configureStore";
import SummaryView from "../PageLayout/PageLayout_SummaryView";
import PageLayoutTaskColumnView from "../PageLayout/PageLayout_TaskColumnView";
import SideViewTabbedSection from "../SideView/SideView_TabbedSection";
import TopViewSprintInfoCard from "../TopView/TopView_SprintInfoCard";

interface Props {
  page: string;
}

export default function SprintView({ page }: Props) {
  // redux state
  const { currentSprint, currentBoard } = useAppSelector(
    (state) => state.sprintView
  );
  const sprints = useAppSelector(
    (state) =>
      state.user.userData?.boards.find((b) => b.boardEntityId == currentBoard)
        ?.sprints
  );

  // react state
  const [taskToBeEditedId, setTaskToBeEditedId] = useState<string[]>([]);

  // handle edit task panel opened for task
  const toggleEditTask = (taskId: string) => {
    // open or close edit panel for task in question
    if (taskToBeEditedId.includes(taskId)) {
      var taskToBeEditedIdCopy = [...taskToBeEditedId];
      var taskIndex = taskToBeEditedIdCopy.findIndex((t) => t === taskId);
      taskToBeEditedIdCopy.splice(taskIndex, 1);
      setTaskToBeEditedId(taskToBeEditedIdCopy);
    } else {
      var taskToBeEditedIdCopy = [...taskToBeEditedId];
      taskToBeEditedIdCopy.push(taskId);
      setTaskToBeEditedId(taskToBeEditedIdCopy);
    }
  };

  return (
    <Grid
      container
      margin="10px 10px 0px 0px"
      sx={{ height: "88%" }}
      columns={12}
    >
      <Grid item lg={9} md={8}>
        {page == "sprint" && (
          <Grid
            container
            columns={13}
            justifyContent="center"
            display="flex"
            flexDirection="row"
          >
            <Grid
              item
              xs
              justifyContent="center"
              sx={{ borderRadius: "25px" }}
              margin="10px"
            >
              <TopViewSprintInfoCard />
            </Grid>
          </Grid>
        )}
        <Grid container spacing={1} justifyContent="center" display="flex">
          {page == "summary" && (
            <Grid
              item
              md
              sm={12}
              xs={12}
              justifyContent="center"
              sx={{ borderRadius: "25px" }}
              margin="10px"
            >
              <SummaryView
                taskToBeEditedId={taskToBeEditedId}
                toggleEditTask={toggleEditTask}
              />
            </Grid>
          )}
          {page == "sprint" && (
            <>
              <Grid
                item
                md
                sm={12}
                xs={12}
                justifyContent="center"
                sx={{ borderRadius: "25px" }}
                margin="10px"
              >
                <PageLayoutTaskColumnView
                  sprintId={currentSprint || ""}
                  stateTitle={"New"}
                  tasks={
                    sprints
                      ?.find((s) => s.sprintEntityId == currentSprint)
                      ?.tasks.filter((task) => {
                        return task.currentState === 0;
                      })
                      .sort((a, b) => a.order - b.order) || []
                  }
                  toggleEditTask={toggleEditTask}
                  tasksToBeEdited={taskToBeEditedId}
                />
              </Grid>
              <Grid
                item
                lg
                md={12}
                sm={12}
                xs={12}
                justifyContent="center"
                sx={{ borderRadius: "25px" }}
                margin="10px"
              >
                <PageLayoutTaskColumnView
                  sprintId={currentSprint || ""}
                  stateTitle={"Active"}
                  tasks={
                    sprints
                      ?.find((s) => s.sprintEntityId == currentSprint)
                      ?.tasks.filter((task) => {
                        return task.currentState === 1;
                      })
                      .sort((a, b) => a.order - b.order) || []
                  }
                  toggleEditTask={toggleEditTask}
                  tasksToBeEdited={taskToBeEditedId}
                />
              </Grid>
              <Grid
                item
                lg
                md={12}
                sm={12}
                xs={12}
                justifyContent="center"
                sx={{ borderRadius: "25px" }}
                margin="10px"
              >
                <PageLayoutTaskColumnView
                  sprintId={currentSprint || ""}
                  stateTitle={"Completed"}
                  tasks={
                    sprints
                      ?.find((s) => s.sprintEntityId == currentSprint)
                      ?.tasks.filter((task) => {
                        return task.currentState === 2;
                      })
                      .sort((a, b) => a.order - b.order) || []
                  }
                  toggleEditTask={toggleEditTask}
                  tasksToBeEdited={taskToBeEditedId}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Grid>
      <Grid item lg={3} md={4}>
        <Box
          sx={{
            marginLeft: "20px",
            height: "100%",
            width: "90%",
            padding: "10px",
          }}
        >
          <SideViewTabbedSection />
        </Box>
      </Grid>
    </Grid>
  );
}
