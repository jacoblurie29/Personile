import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setCurrentSprint, setLoading } from "./sprintSlice";
import SprintTopCardView from "./SprintTopCardView";
import TaskColumnView from "./TaskColumnView";


// "{tasks}: Props" destructures the props for the fields inside
export default function SprintView() {

        const sprints = useAppSelector(state => state.user.userData?.sprints);
        const { currentSprint } = useAppSelector(state => state.sprintView);
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
        <Box marginTop='20px'>
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
                    <Grid item md  sm={12} xs={12} justifyContent="center" sx={{ borderRadius:'5px'}} margin='10px'>
                        <TaskColumnView sprintId={currentSprint || ""} stateTitle={"Active"} tasks={sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
                            return task.currentState === 1;
                        }) || []} toggleEditTask={toggleEditTask} tasksToBeEdited={taskToBeEditedId}/>
                    </Grid>
                    <Grid item md sm={12} xs={12} justifyContent="center" sx={{ borderRadius:'5px'}} margin='10px'>
                        <TaskColumnView sprintId={currentSprint || ""} stateTitle={"Completed"} tasks={sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
                            return task.currentState === 2;
                        }) || []} toggleEditTask={toggleEditTask} tasksToBeEdited={taskToBeEditedId}/>
                    </Grid>
            </Grid>
        </Box>
        
        
    )
}