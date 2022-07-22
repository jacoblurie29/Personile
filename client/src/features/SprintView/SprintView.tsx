import { Box, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useAppSelector } from "../../app/store/configureStore";
import SprintBoardSideView from "./SprintBoardSideView";
import SprintTopCardView from "./SprintTopCardView";
import TaskColumnView from "./TaskColumnView";


// "{tasks}: Props" destructures the props for the fields inside
export default function SprintView() {

    const { currentSprint, currentBoard } = useAppSelector(state => state.sprintView);
    const sprints = useAppSelector(state => state.user.userData?.boards.find(b => b.boardEntityId == currentBoard)?.sprints);
    const [taskToBeEditedId, setTaskToBeEditedId] = useState<string[]>([]);
        
;


        const toggleEditTask = (taskId: string) => {

            if(taskToBeEditedId.includes(taskId)) {
                var taskToBeEditedIdCopy = [...taskToBeEditedId];
                var taskIndex = taskToBeEditedIdCopy.findIndex(t => t === taskId);
                taskToBeEditedIdCopy.splice(taskIndex, 1);
                setTaskToBeEditedId(taskToBeEditedIdCopy);
            } else {
                var taskToBeEditedIdCopy = [...taskToBeEditedId];
                taskToBeEditedIdCopy.push(taskId);
                console.log(taskToBeEditedIdCopy)
                setTaskToBeEditedId(taskToBeEditedIdCopy);
            }
        }
    
    return (
        <Grid container margin='10px 10px 0px 0px' sx={{height: '88%'}} columns={12}>
            <Grid item lg={9} md={8} sx={{backgroundColor: '#D9E8F9', borderRadius: '15px',}}>
                <Grid container 
                    columns={13}
                    justifyContent='center'
                    display='flex'
                    flexDirection='row'>
                    <Grid item xs justifyContent="center" sx={{borderRadius:'5px'}} margin='10px'>
                        <SprintTopCardView />
                    </Grid>
                </Grid>
                <Grid container 
                    spacing={1}
                    justifyContent='center'
                    display='flex'
                    >
                        <Grid item md sm={12} xs={12} justifyContent="center" sx={{borderRadius:'5px'}} margin='10px'>
                            <TaskColumnView sprintId={currentSprint || ""} stateTitle={"New"} tasks={sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
                                return task.currentState === 0;
                            }) || []} toggleEditTask={toggleEditTask} tasksToBeEdited={taskToBeEditedId} />
                        </Grid>  
                        <Grid item lg md={12} sm={12} xs={12} justifyContent="center" sx={{ borderRadius:'5px'}} margin='10px'>
                            <TaskColumnView sprintId={currentSprint || ""} stateTitle={"Active"} tasks={sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
                                return task.currentState === 1;
                            }) || []} toggleEditTask={toggleEditTask} tasksToBeEdited={taskToBeEditedId}/>
                        </Grid>
                        <Grid item lg md={12} sm={12} xs={12} justifyContent="center" sx={{ borderRadius:'5px'}} margin='10px'>
                            <TaskColumnView sprintId={currentSprint || ""} stateTitle={"Completed"} tasks={sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
                                return task.currentState === 2;
                            }) || []} toggleEditTask={toggleEditTask} tasksToBeEdited={taskToBeEditedId}/>
                        </Grid>
                </Grid>
            </Grid>
            <Grid item lg={3} md={4}>
                <Box  sx={{backgroundColor: '#D9E8F9', borderRadius: '15px', marginLeft: '20px', height: '100%', width: '90%', padding: '10px'}}>
                    <SprintBoardSideView />
                </Box>
            </Grid>
        </Grid>
        
        
    )
}