import { LoadingButton } from "@mui/lab";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Divider, Grid, Typography, useTheme, Zoom } from "@mui/material";
import { Task } from "app/models/task";
import { mapTaskToUpdateTask } from "app/models/updateTask";
import { removeTaskFromSprintAsync, updateTaskAsync } from "app/state/userSlice";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { useEffect, useState } from "react";
import { removeFromIsExpanded, addToIsExpanded } from "../Redux/sprintSlice";
import ViewTaskStateToggleButton from "../ViewTask/ViewTask_StateToggleButton";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TaskStateTitle from "../SummaryView/SummaryView_TaskStateTitle";
import TaskActionButtons from "../SummaryView/SummaryView_TaskActionButtons";
import SummaryTaskMoreDetails from "../SummaryView/SummaryView_SummaryTaskMoreDetails";

export default function SummaryView() {

    const allTasks : Task[] = [];

    const { currentSprint, currentBoard, isExpanded : expanded } = useAppSelector(state => state.sprintView);
    const tasks = useAppSelector(state => state.user.userData?.boards.find(b => b.boardEntityId == currentBoard)?.sprints?.flatMap(s => s.tasks)) || [];
    const [taskToBeEditedId, setTaskToBeEditedId] = useState<string[]>([]);
    const {status} = useAppSelector(state => state.user)
    const userEntityId = useAppSelector(state => state.user.userData?.userEntityId);
    const dispatch = useAppDispatch();
    const theme = useTheme();

    useEffect(() => {
        console.log(tasks)
    }, [])
    

    const toggleEditTask = (taskId: string) => {

        if(taskToBeEditedId.includes(taskId)) {
            var taskToBeEditedIdCopy = [...taskToBeEditedId];
            var taskIndex = taskToBeEditedIdCopy.findIndex(t => t === taskId);
            taskToBeEditedIdCopy.splice(taskIndex, 1);
            setTaskToBeEditedId(taskToBeEditedIdCopy);
        } else {
            var taskToBeEditedIdCopy = [...taskToBeEditedId];
            taskToBeEditedIdCopy.push(taskId);
            setTaskToBeEditedId(taskToBeEditedIdCopy);
        }
    }

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
            var currentBoardId = currentBoard;

            if (currentUserId == undefined || currentSprintId == null || currentBoardId == null ) return;

            dispatch(updateTaskAsync({userId: currentUserId, boardId: currentBoardId, sprintId: currentSprintId, taskId: currentTaskId, updatedTaskDto: newUpdateTask, previousState: previousState, futureState: newTask}));
            
            dispatch(removeFromIsExpanded(currentTaskId));
        }
    }

    return (
            <Box sx={{width: "100%"}}>
                <Card sx={{borderRadius: '5px 5px 0 0', background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`}}>
                    <Typography variant='h2' sx={{fontWeight: '700', color: 'white', padding: '15px'}}>{"Tasks"}</Typography>
                </Card>
                {tasks.map((task, index) => (
                        <Zoom in={true} timeout={true ? (index) * 250 : 250} key={"SummaryCard-" + index}>  
                            <Accordion elevation={3} expanded={expanded?.includes(task.taskEntityId)}  onChange={handleChange(task.taskEntityId)} key={task.taskEntityId}>
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

                    
                ))}
                
              {  
            /*
                I need to define a new card here, along with a new edit card for this view.
                It is worth looking into reusing parts of the old cards however the new structure will most likely
                require a completly new element. 

                New card view will have action buttons and an expandable pain for the information. 
                Will use React router as function for editing the task. 
                Should look the same as the column cards except written out horizontally instead of vertically.

                The new cards should be order with the following hierarchy:

                    1. Sprint (Most recent at top)
                    2. Two blocks - One with due dates, the other without
                    3. Non - due date will be ordered by creation date for now


                I think the tasks need a new data point called "order" which will be a unique sequential identifier
                that is created upon them being added. For now, we can use up/down arrows in the summary view to move them but 
                in the future React draggable is an option. In the sprint view, the order will be followed but it can only be
                altered in the summary view. Maybe small up/down arrow buttons can make requests to change order in both.

                TODO for this:

                Create cards (view + add/edit for the new view)
                Work on sizing for cards on window shrink/grow
                Create functions for toggles on the cards (edit, delete, up, down, change state (tri-button))
                Create order data point
                Create endpoint for order manipulation
                Add ordering to the creation of new tasks (front AND backend (the seed data))
                Add ordering to sprint view
                Add ordering to the summary view
                Debug/Cleanup
            */
        }
    </Box>

    );
}