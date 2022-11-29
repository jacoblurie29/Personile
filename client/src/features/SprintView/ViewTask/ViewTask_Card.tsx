import { Accordion, AccordionSummary, Box, Typography, Divider, AccordionDetails, Grid, Zoom, IconButton } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import ViewTaskMoreDetails from "./ViewTask_MoreDetails";
import { Task } from "../../../app/models/task";
import { useAppSelector, useAppDispatch } from "../../../app/store/configureStore";
import { removeFromIsExpanded, addToIsExpanded } from "../Redux/sprintSlice";
import { changeTaskStateAsync, moveTaskOrderAsync, removeTaskFromSprintAsync, updateTaskAsync } from "../../../app/state/userSlice";
import ViewTaskStateToggleButton from "./ViewTask_StateToggleButton";
import { mapTaskToUpdateTask } from "app/models/updateTask";
import ViewTaskStateDisplay from "./ViewTask_StateDisplay";
import { useState } from "react";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ViewTaskActionButton from "./ViewTask_ActionButton";
import TaskChangeSprintCard from "../ChangeTaskSprint/TaskChangeSprint_Card";

interface Props {
    task: Task,
    toggleEditTask: (taskId: string) => void,
    indexForAnimation: number,
    sprintId: string,
    index: number,
    max: number,
    previousIndex: number,
    nextIndex: number
}



export default function ViewTaskCard({task, toggleEditTask, indexForAnimation, sprintId, index, max, previousIndex, nextIndex}: Props) {

    // redux state
    const {status} = useAppSelector(state => state.user)
    const {currentSprint, isExpanded: expanded, currentBoard } = useAppSelector(state => state.sprintView);
    const userEntityId = useAppSelector(state => state.user.userData?.userEntityId);
    const dispatch = useAppDispatch();

    // react state
    const [zoom, setZoom] = useState<boolean>(true);
    const [moveSprint, setMoveSprint] = useState<boolean>(false);

    // expanding of view panel
    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
       if(expanded?.includes(panel)) {
          dispatch(removeFromIsExpanded(panel));
       } else {
          dispatch(addToIsExpanded(panel));
       }
    };

    const descriptionStylesNotExpanded = {
        fontSize: 14,
        marginLeft: '3%',
        width:'90%',
        display: '-webkit-box',
        overflow: 'hidden',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: 3
    }

    const descriptionStylesExpanded = {
        fontSize: 14,
        marginLeft: '3%',
        width:'90%',
    }

    // handle state of task (new, current, completed)
    const handleStateChange = (currentTask: Task, currentState: number, newState: number) => {
        
        // disallow change of state if state hasn't changed
        if(currentState != newState) {

            // shape new state
            var newTask = {...currentTask};
            newTask.currentState = newState;
            
            // find current task id
            var currentTaskId = newTask.taskEntityId;

            // current redux id variables
            var currentUserId = userEntityId;
            var currentSprintId = currentSprint;
            var currentBoardId = currentBoard;

            // null check
            if (currentUserId == undefined || currentSprintId == null || currentBoardId == null ) return;

            // update state
            //dispatch(updateTaskAsync({userId: currentUserId, boardId: currentBoardId, sprintId: currentSprintId, taskId: currentTaskId, updatedTaskDto: newUpdateTask, previousState: previousState, futureState: newTask}));
            
            // Will work on this in future -> stand alone patch request for state change of task.
            dispatch(changeTaskStateAsync({userId: currentUserId, boardId: currentBoardId, sprintId: currentSprintId, taskId: currentTaskId, newState: newState.toString(), newOrder: currentTask.order!.toString(), oldOrder: currentTask.order!.toString()}))


            // close expanded panel
            dispatch(removeFromIsExpanded(currentTaskId));
        }
    }

    const changeOrderOfTask = (taskId: string, sprintId: string, oldOrderLocation: number, newOrderLocation: number) => {
        // null checks
        if(userEntityId == null) return;
        if(currentSprint == null) return;
        if(currentBoard == null) return;

        dispatch(moveTaskOrderAsync({userId: userEntityId, boardId: currentBoard, sprintId: sprintId, taskId: taskId, oldOrder: oldOrderLocation.toString(), newOrder: newOrderLocation.toString()})).catch((error: any) => console.log(error))
    }

    // Stops the accordian from opening due to the click in the summary area
    const onClickDelete = (event: any) => {
        event.stopPropagation();
    }


    return (
        <Zoom in={zoom} timeout={zoom ? (indexForAnimation + 1) * 500 : 500}>  
            <Accordion sx={{borderLeft: '1px', borderRight: '1px', borderBottom: '1px', borderTop: expanded?.includes(task.taskEntityId) ? '1px' : '0px', borderStyle: 'solid', borderColor: 'grey.200'}} elevation={0} expanded={expanded?.includes(task.taskEntityId)}  onChange={handleChange(task.taskEntityId)} key={task.taskEntityId}>
                <AccordionSummary sx={{'.MuiAccordionSummary-content': {margin: '10px 0px !important'}}}>
                    <Box flexGrow={1}>
                        <Grid container columns={6}>
                            <Grid item xs = {6}>
                                <ViewTaskStateDisplay title={task.name} currentState={task.currentState}/>
                            </Grid>
                            <Grid item xs = {6}>
                                <Grid container>
                                    <Grid item xs={9}>
                                        <Typography sx={expanded?.includes(task.taskEntityId) ? descriptionStylesExpanded : descriptionStylesNotExpanded} color="grey.500">
                                            {task.description}
                                        </Typography>   
                                    </Grid>    
                                    <Grid item xs={3} display={"flex"} justifyContent={'flex-end'} sx={{fontSize: '20px'}}>
                                        <IconButton disabled={index == 0 || status.includes("pending")} sx={{height: 'fit-content',  margin: 'auto'}} onClick={(event) => {onClickDelete(event); changeOrderOfTask(task.taskEntityId, sprintId, task.order, previousIndex)}}>
                                            <KeyboardArrowUpIcon sx={{ fontSize: '20px'}} />
                                        </IconButton>
                                        <IconButton disabled={index == max || status.includes("pending")} sx={{height: 'fit-content',  margin: 'auto'}} onClick={(event) => {onClickDelete(event); changeOrderOfTask(task.taskEntityId, sprintId, task.order, nextIndex)}}>
                                            <KeyboardArrowDownIcon sx={{fontSize: '20px'}} />
                                        </IconButton>
                                    </Grid>
                                </Grid>  
                            </Grid>
                        </Grid>

                    </Box>
                </AccordionSummary>
                <AccordionDetails sx={{alignItems: 'center'}}>
                    <ViewTaskMoreDetails focusedTask={task} />
                    <Grid container sx={{display: 'flex', width: 'auto'}}>
                        <Grid item xs={6}>
                            <Box sx={{flexGrow: 1, textAlign: 'left', marginRight: '5px', marginTop: '5px'}}>
                                <ViewTaskStateToggleButton sprintId={sprintId} startingState={task.currentState} task={task} handleChangeState={handleStateChange}/>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{flexGrow: 1, textAlign: 'right', marginRight: '5px', marginTop: '5px'}}>
                                <ViewTaskActionButton task={task} toggleEditTask={toggleEditTask} setZoom={setZoom} setMoveSprint={setMoveSprint} />
                                {moveSprint && <TaskChangeSprintCard setMoveSprint={setMoveSprint} task={task} oldSprintId={sprintId || ""} />}
                            </Box>
                        </Grid>
                    </Grid>
                </AccordionDetails>
            </Accordion>
        </Zoom>
    )
}