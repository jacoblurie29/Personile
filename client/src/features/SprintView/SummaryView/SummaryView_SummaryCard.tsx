import { LoadingButton } from "@mui/lab";
import { Accordion, AccordionSummary, Box, Grid, Divider, AccordionDetails, Zoom } from "@mui/material";
import { Task } from "app/models/task";
import { removeTaskFromSprintAsync, updateTaskAsync } from "app/state/userSlice";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import ViewTaskStateToggleButton from "../ViewTask/ViewTask_StateToggleButton";
import SummaryTaskMoreDetails from "./SummaryView_SummaryTaskMoreDetails";
import TaskActionButtons from "./SummaryView_TaskActionButtons";
import TaskStateTitle from "./SummaryView_TaskStateTitle";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { mapTaskToUpdateTask } from "app/models/updateTask";
import { useEffect, useState } from "react";
import { removeFromIsExpanded, addToIsExpanded } from "../Redux/sprintSlice";

interface Props { 
    task: Task,
    index: number,
    toggleEditTask: (value: string) => void
}

export default function SummaryCard({task, index, toggleEditTask}: Props) {

    // redux state
    const { currentSprint, currentBoard, isExpanded: expanded } = useAppSelector(state => state.sprintView);
    const userEntityId = useAppSelector(state => state.user.userData?.userEntityId);
    const dispatch = useAppDispatch();
    const {status} = useAppSelector(state => state.user);


    // expanded state of panel
    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        if(expanded?.includes(panel)) {
            dispatch(removeFromIsExpanded(panel));
        } else {
            dispatch(addToIsExpanded(panel));
        }
    };

    // change state of task (new, current, completed)
    const handleStateChange = (currentTask: Task, currentState: number, newState: number) => {
        
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

            // null checks
            if (currentUserId == undefined || currentSprintId == null || currentBoardId == null ) return;

            // update state
            dispatch(updateTaskAsync({userId: currentUserId, boardId: currentBoardId, sprintId: currentSprintId, taskId: currentTaskId, updatedTaskDto: newUpdateTask, previousState: previousState, futureState: newTask}));
            
            // close expanded panel
            dispatch(removeFromIsExpanded(currentTaskId));
        }
    }

    useEffect(() => {
        console.log("PASS");
    }, [])


    return (
        <Zoom in={true} timeout={true ? (index) * 250 : 250} key={"SummaryCard-" + index}>  
            <Accordion elevation={3} expanded={expanded?.includes(task.taskEntityId)} onChange={handleChange(task.taskEntityId)} key={task.taskEntityId}>
                <AccordionSummary  sx={{borderRadius: "0px"}}>
                    <Box flexGrow={1}>
                        <Grid container>
                            <Grid item xs={8}>
                                <TaskStateTitle title={task.name} currentState={task.currentState} description={task.description}/>
                            </Grid>
                            <Grid item xs={4}>
                                <TaskActionButtons />
                            </Grid>
                        </Grid>
                    </Box>
                </AccordionSummary>
                <Divider />
                <AccordionDetails sx={{alignItems: 'center'}}>
                    <SummaryTaskMoreDetails focusedTask={task} />
                    <Grid container sx={{display: 'flex', width: 'auto'}}>
                        <Grid item xs={6}>
                            <Box sx={{flexGrow: 1, textAlign: 'left'}}>
                                <ViewTaskStateToggleButton startingState={task.currentState} task={task} handleChangeState={handleStateChange}/>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{flexGrow: 1, textAlign: 'right', marginRight: '5px', marginTop: '5px'}}>
                                <LoadingButton key={"edit-" + task.taskEntityId} variant='contained' sx={{background: "linear-gradient(232deg, rgba(173,173,173,1) 0%, rgba(158,158,158,1) 100%)", borderRadius:"5px", mr:"10px"}} onClick={async () => {await new Promise<void>(done => setTimeout(() => done(), 300)); toggleEditTask(task.taskEntityId)}}><EditIcon sx={{color: 'background.paper'}}/></LoadingButton>
                                <LoadingButton key={"delete-" + task.taskEntityId} loading={status.includes("pendingDeleteTask")} variant='contained' sx={{borderRadius:"5px", background:'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)'}} onClick={() => {dispatch(removeTaskFromSprintAsync({userId: userEntityId || "", boardId: currentBoard || "", sprintId: currentSprint || "", taskId: task.taskEntityId}))}}><DeleteIcon sx={{color: 'background.paper'}} /></LoadingButton>
                            </Box>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Zoom>
    )
}