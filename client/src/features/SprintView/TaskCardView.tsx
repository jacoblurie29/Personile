import { Accordion, AccordionSummary, Box, CardHeader, Typography, Divider, AccordionDetails, Grid } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import TaskMoreDetails from "./TaskMoreDetails";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Task } from "../../app/models/task";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { removeFromIsExpanded, addToIsExpanded } from "./sprintSlice";
import { removeTaskFromSprintAsync, updateTaskStateAsync } from "../../app/state/userSlice";
import StateToggleButton from "./StateToggleButton";
import { mapTaskToUpdateTask } from "app/models/updateTask";

interface Props {
    task: Task,
}

export default function TaskCardView({task}: Props) {

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
            var prevState  = newTask.currentState;
            newTask.currentState = newState;
            var newUpdateTask = mapTaskToUpdateTask(newTask);
            var currentTaskId = newTask.taskEntityId;
            var currentUserId = userEntityId;
            var currentSprintId = currentSprint;

            if (currentUserId == undefined || currentSprintId == null ) return;

            dispatch(updateTaskStateAsync({userId: currentUserId, sprintId: currentSprintId, taskId: currentTaskId, updatedTaskDto: newUpdateTask, updatedTask: newTask, previousState: prevState}));
            
            dispatch(removeFromIsExpanded(currentTaskId));
        }
    }





    return (
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
                        <LoadingButton key={task.taskEntityId} loading={status.includes("pending")} variant='contained' color='error' onClick={() => dispatch(removeTaskFromSprintAsync({userId: userEntityId || "", sprintId: currentSprint || "", taskId: task.taskEntityId}))}>Delete task</LoadingButton>
                    </Box>
                </Grid>
            </Grid>
            </AccordionDetails>
        </Accordion>
    )
}