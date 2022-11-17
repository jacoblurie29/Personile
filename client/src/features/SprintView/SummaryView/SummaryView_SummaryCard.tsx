import { Accordion, AccordionSummary, Box, Grid, Divider, AccordionDetails, Zoom } from "@mui/material";
import { Task } from "app/models/task";
import { changeTaskStateAsync } from "app/state/userSlice";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import ViewTaskStateToggleButton from "../ViewTask/ViewTask_StateToggleButton";
import SummaryTaskMoreDetails from "./SummaryView_SummaryTaskMoreDetails";
import TaskActionButtons from "./SummaryView_TaskActionButtons";
import TaskStateTitle from "./SummaryView_TaskStateTitle";
import { removeFromIsExpanded, addToIsExpanded } from "../Redux/sprintSlice";
import ViewTaskActionButton from "../ViewTask/ViewTask_ActionButton";
import { useState } from "react";
import TaskChangeSprintCard from "../ChangeTaskSprint/TaskChangeSprint_Card";

interface Props { 
    task: Task,
    animationIndex: number,
    orderIndex: number,
    max: number,
    sprintId: string,
    toggleEditTask: (value: string) => void,
    handleMoveTask: (taskId: string, sprintId: string, oldOrder: number, newOrder: number) => void
}

export default function SummaryCard({task, animationIndex, toggleEditTask, handleMoveTask, max, orderIndex, sprintId}: Props) {

    // redux state
    const { currentSprint, currentBoard, isExpanded: expanded } = useAppSelector(state => state.sprintView);
    const userEntityId = useAppSelector(state => state.user.userData?.userEntityId);
    const dispatch = useAppDispatch();
    const {status} = useAppSelector(state => state.user);

    // react state
    const [zoom, setZoom] = useState<boolean>(true);
    const [moveSprint, setMoveSprint] = useState<boolean>(false);


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
    const handleStateChange = (currentTask: Task, currentState: number, newState: number, sprintId: string) => {
        
        if(currentState != newState) {

            // shape new state
            var newTask = {...currentTask};
            newTask.currentState = newState;
            
            // find current task id
            var currentTaskId = newTask.taskEntityId;

            // current redux id variables
            var currentUserId = userEntityId;
            var currentSprintId = sprintId;
            var currentBoardId = currentBoard;

            // null checks
            if (currentUserId == undefined || currentSprintId == null || currentBoardId == null ) return;

            // update state
            dispatch(changeTaskStateAsync({userId: currentUserId, boardId: currentBoardId, sprintId: currentSprintId, taskId: currentTaskId, newState: newState.toString(), newOrder: currentTask.order!.toString(), oldOrder: currentTask.order!.toString()}))

            // close expanded panel
            dispatch(removeFromIsExpanded(currentTaskId));
        }
    }

    return (
        <Zoom in={true} timeout={true ? (animationIndex) * 250 : 250} key={"SummaryCard-" + animationIndex}>  
            <Accordion elevation={3} expanded={expanded?.includes(task.taskEntityId)} onChange={handleChange(task.taskEntityId)} key={task.taskEntityId}>
                <AccordionSummary  sx={{borderRadius: "0px"}}>
                    <Box flexGrow={1}>
                        <Grid container>
                            <Grid item xs={8}>
                                <TaskStateTitle title={task.name} currentState={task.currentState} description={task.description}/>
                            </Grid>
                            <Grid item xs={4}>
                                <TaskActionButtons handleMoveTask={handleMoveTask} sprintId={sprintId} task={task} index={orderIndex} max={max} />
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
                                <ViewTaskStateToggleButton startingState={task.currentState} sprintId={sprintId} task={task} handleChangeState={handleStateChange}/>
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