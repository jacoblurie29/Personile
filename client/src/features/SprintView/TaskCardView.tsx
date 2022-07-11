import { Accordion, AccordionSummary, Box, CardHeader, Typography, Divider, AccordionDetails, Grid, Fade, Grow } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import TaskMoreDetails from "./TaskMoreDetails";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Task } from "../../app/models/task";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { removeFromIsExpanded, addToIsExpanded } from "./sprintSlice";
import { removeTaskFromSprintAsync, updateTaskAsync } from "../../app/state/userSlice";
import StateToggleButton from "./StateToggleButton";
import { mapTaskToUpdateTask } from "app/models/updateTask";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

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


    function chooseColor(title: number) {
        return title === 0 
            ? 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)' 
            : title === 1 ? 'linear-gradient(90deg, rgba(255,209,125,1) 0%, rgba(255,196,54,1) 100%)' 
            : 'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)'
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

            if (currentUserId == undefined || currentSprintId == null ) return;

            dispatch(updateTaskAsync({userId: currentUserId, sprintId: currentSprintId, taskId: currentTaskId, updatedTaskDto: newUpdateTask, previousState: previousState, futureState: newTask}));
            
            dispatch(removeFromIsExpanded(currentTaskId));
        }
    }





    return (
        <Grow in={true} timeout={(indexForAnimation + 1) * 500}>
        <Accordion sx={{background: chooseColor(task.currentState), marginBottom: '10px', borderRadius: '5px'}} expanded={expanded?.includes(task.taskEntityId)}  onChange={handleChange(task.taskEntityId)} key={task.taskEntityId}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box flexGrow={1}>
                    <CardHeader title = {task.name} sx={{color: 'white'}} titleTypographyProps={{variant: 'h5', fontFamily:'Open Sans', fontWeight:'700'}}/>
                    <Typography sx={{ fontSize: 14, marginLeft: '4%', width:'90%' }} color="text.secondary">
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
                        <LoadingButton key={"edit-" + task.taskEntityId} loading={status.includes("pending")} variant='contained' sx={{backgroundColor: "#AAAAAA", borderRadius:"5px 0 0 5px"}} onClick={() => toggleEditTask(task.taskEntityId)}><EditIcon color="primary" /></LoadingButton>
                        <LoadingButton key={"delete-" + task.taskEntityId} loading={status.includes("pendingDeleteTask")} variant='contained' color='error' sx={{borderRadius:"0 5px 5px 0"}} onClick={() => dispatch(removeTaskFromSprintAsync({userId: userEntityId || "", sprintId: currentSprint || "", taskId: task.taskEntityId}))}><DeleteIcon /></LoadingButton>
                    </Box>
                </Grid>
            </Grid>
            </AccordionDetails>
        </Accordion>
        </Grow>
    )
}