import { Accordion, AccordionSummary, Box, Typography, Divider, AccordionDetails, Grid, Zoom } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import TaskMoreDetails from "./TaskMoreDetails";
import { Task } from "../../app/models/task";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { removeFromIsExpanded, addToIsExpanded } from "./sprintSlice";
import { removeTaskFromSprintAsync, updateTaskAsync } from "../../app/state/userSlice";
import StateToggleButton from "./StateToggleButton";
import { mapTaskToUpdateTask } from "app/models/updateTask";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskStateDisplay from "./TaskStateDisplay";
import { useState } from "react";

interface Props {
    task: Task,
    toggleEditTask: (taskId: string) => void,
    indexForAnimation: number
}



export default function TaskCardView({task, toggleEditTask, indexForAnimation}: Props) {

    const {status} = useAppSelector(state => state.user)
    const {currentSprint, isExpanded: expanded } = useAppSelector(state => state.sprintView);
    const userEntityId = useAppSelector(state => state.user.userData?.userEntityId);
    const dispatch = useAppDispatch();
    const [zoom, setZoom] = useState<boolean>(true);

    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
       if(expanded?.includes(panel)) {
          dispatch(removeFromIsExpanded(panel));
       } else {
          dispatch(addToIsExpanded(panel));
       }
    };

    const handleStateChange = (currentTask: Task, currentState: number, newState: number) => {
        
        if(currentState != newState) {

            var newTask = {...currentTask};
            var previousState  = {...newTask};
            newTask.currentState = newState;
            var newUpdateTask = mapTaskToUpdateTask(newTask);
            var currentTaskId = newTask.taskEntityId;
            var currentUserId = userEntityId;
            var currentSprintId = currentSprint;

            if (currentUserId == undefined || currentSprintId == null ) return;

            dispatch(updateTaskAsync({userId: currentUserId, sprintId: currentSprintId, taskId: currentTaskId, updatedTaskDto: newUpdateTask, previousState: previousState, futureState: newTask}));
            
            dispatch(removeFromIsExpanded(currentTaskId));
        }
    }


    return (
        <Zoom in={zoom} timeout={zoom ? (indexForAnimation + 1) * 500 : 500}>  
            <Accordion elevation={2} expanded={expanded?.includes(task.taskEntityId)}  onChange={handleChange(task.taskEntityId)} key={task.taskEntityId}>
                <AccordionSummary>
                    <Box flexGrow={1}>
                        <TaskStateDisplay title={task.name} currentState={task.currentState}/>
                        <Typography sx={{ fontSize: 14, marginLeft: '4%', width:'90%' }} color="grey.500">
                            {task.description}
                        </Typography> 
                    </Box>
                </AccordionSummary>
                <Divider />
                <AccordionDetails sx={{alignItems: 'center'}}>
                <TaskMoreDetails focusedTask={task} />
                <Grid container sx={{display: 'flex', width: 'auto'}}>
                    <Grid item xs={6}>
                        <Box sx={{flexGrow: 1, textAlign: 'left'}}>
                            <StateToggleButton startingState={task.currentState} task={task} handleChangeState={handleStateChange}/>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{flexGrow: 1, textAlign: 'right', marginRight: '5px', marginTop: '5px'}}>
                            <LoadingButton key={"edit-" + task.taskEntityId} loading={status.includes("pending")} variant='contained' sx={{background: "linear-gradient(232deg, rgba(173,173,173,1) 0%, rgba(158,158,158,1) 100%)", borderRadius:"5px", mr:"10px"}} onClick={async () => {setZoom(false); await new Promise<void>(done => setTimeout(() => done(), 300)); toggleEditTask(task.taskEntityId)}}><EditIcon sx={{color: 'background.paper'}}/></LoadingButton>
                            <LoadingButton key={"delete-" + task.taskEntityId} loading={status.includes("pendingDeleteTask")} variant='contained' sx={{borderRadius:"5px", background:'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)'}} onClick={() => {dispatch(removeTaskFromSprintAsync({userId: userEntityId || "", sprintId: currentSprint || "", taskId: task.taskEntityId}))}}><DeleteIcon sx={{color: 'background.paper'}} /></LoadingButton>
                        </Box>
                    </Grid>
                </Grid>
                </AccordionDetails>
            </Accordion>
        </Zoom>
    )
}