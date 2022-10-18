import { Accordion, AccordionSummary, Box, Typography, Divider, AccordionDetails, Grid, Zoom } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import ViewTaskMoreDetails from "./ViewTask_MoreDetails";
import { Task } from "../../../app/models/task";
import { useAppSelector, useAppDispatch } from "../../../app/store/configureStore";
import { removeFromIsExpanded, addToIsExpanded } from "../Redux/sprintSlice";
import { removeTaskFromSprintAsync, updateTaskAsync } from "../../../app/state/userSlice";
import ViewTaskStateToggleButton from "./ViewTask_StateToggleButton";
import { mapTaskToUpdateTask } from "app/models/updateTask";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ViewTaskStateDisplay from "./ViewTask_StateDisplay";
import { useState } from "react";

interface Props {
    task: Task,
    toggleEditTask: (taskId: string) => void,
    indexForAnimation: number
}



export default function ViewTaskCard({task, toggleEditTask, indexForAnimation}: Props) {

    // redux state
    const {status} = useAppSelector(state => state.user)
    const {currentSprint, isExpanded: expanded, currentBoard } = useAppSelector(state => state.sprintView);
    const userEntityId = useAppSelector(state => state.user.userData?.userEntityId);
    const dispatch = useAppDispatch();

    // react state
    const [zoom, setZoom] = useState<boolean>(true);

    // expanding of view panel
    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
       if(expanded?.includes(panel)) {
          dispatch(removeFromIsExpanded(panel));
       } else {
          dispatch(addToIsExpanded(panel));
       }
    };

    // handle state of task (new, current, completed)
    const handleStateChange = (currentTask: Task, currentState: number, newState: number) => {
        
        // disallow change of state if state hasn't changed
        if(currentState != newState) {

            // shape new state
            var newTask = {...currentTask};
            newTask.currentState = newState;
            var newUpdateTask = mapTaskToUpdateTask(newTask);

            // store previous state
            var previousState  = {...newTask};
            
            // find current task id
            var currentTaskId = newTask.taskEntityId;

            // current redux id variables
            var currentUserId = userEntityId;
            var currentSprintId = currentSprint;
            var currentBoardId = currentBoard;

            // null check
            if (currentUserId == undefined || currentSprintId == null || currentBoardId == null ) return;

            // update state
            dispatch(updateTaskAsync({userId: currentUserId, boardId: currentBoardId, sprintId: currentSprintId, taskId: currentTaskId, updatedTaskDto: newUpdateTask, previousState: previousState, futureState: newTask}));
            
            // close expanded panel
            dispatch(removeFromIsExpanded(currentTaskId));
        }
    }


    return (
        <Zoom in={zoom} timeout={zoom ? (indexForAnimation + 1) * 500 : 500}>  
            <Accordion elevation={2} expanded={expanded?.includes(task.taskEntityId)}  onChange={handleChange(task.taskEntityId)} key={task.taskEntityId}>
                <AccordionSummary>
                    <Box flexGrow={1}>
                        <Grid container columns={1}>
                            <Grid item xs = {6}>
                                <ViewTaskStateDisplay title={task.name} currentState={task.currentState}/>
                            </Grid>
                            <Grid item xs = {6}>
                                <Typography sx={{ fontSize: 14, marginLeft: '4%', width:'90%' }} color="grey.500">
                                    {task.description}
                                </Typography>     
                            </Grid>
                        </Grid>

                    </Box>
                </AccordionSummary>
                <Divider />
                <AccordionDetails sx={{alignItems: 'center'}}>
                <ViewTaskMoreDetails focusedTask={task} />
                <Grid container sx={{display: 'flex', width: 'auto'}}>
                    <Grid item xs={6}>
                        <Box sx={{flexGrow: 1, textAlign: 'left'}}>
                            <ViewTaskStateToggleButton startingState={task.currentState} task={task} handleChangeState={handleStateChange}/>
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{flexGrow: 1, textAlign: 'right', marginRight: '5px', marginTop: '5px'}}>
                            <LoadingButton key={"edit-" + task.taskEntityId} variant='contained' sx={{background: "linear-gradient(232deg, rgba(173,173,173,1) 0%, rgba(158,158,158,1) 100%)", borderRadius:"5px", mr:"10px"}} onClick={async () => {setZoom(false); await new Promise<void>(done => setTimeout(() => done(), 300)); toggleEditTask(task.taskEntityId)}}><EditIcon sx={{color: 'background.paper'}}/></LoadingButton>
                            <LoadingButton key={"delete-" + task.taskEntityId} loading={status.includes("pendingDeleteTask")} variant='contained' sx={{borderRadius:"5px", background:'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)'}} onClick={() => {dispatch(removeTaskFromSprintAsync({userId: userEntityId || "", boardId: currentBoard || "", sprintId: currentSprint || "", taskId: task.taskEntityId}))}}><DeleteIcon sx={{color: 'background.paper'}} /></LoadingButton>
                        </Box>
                    </Grid>
                </Grid>
                </AccordionDetails>
            </Accordion>
        </Zoom>
    )
}