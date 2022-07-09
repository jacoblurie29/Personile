import { Box, Button, Checkbox, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader, TextField, Typography } from "@mui/material";
import { Task } from "../../app/models/task";
import CircleIcon from '@mui/icons-material/Circle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import AddSubtaskTextField from "./AddSubtaskTextField";
import { v4 as uuidv4 } from 'uuid';
import agent from "app/api/agent";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { addSubTaskToTaskAsync, updateSubtaskStateAsync } from "app/state/userSlice";
import { toast } from "react-toastify";

interface Props {
    task: Task,
    isDialog: boolean
}

export default function SubTasksView({task, isDialog}: Props) {

    const methods = useForm();

    const { control, handleSubmit } = useForm();

    const [newSubTask, setNewSubTask] = useState<boolean>(false);
    const [newSubTaskValue, setNewSubTaskValue] = useState<string>("");

    const dispatch = useAppDispatch();
    const { currentSprint } = useAppSelector(state => state.sprintView);
    const userId = useAppSelector(state => state.user.userData?.userEntityId);

    const handleSubtaskState = (value: number) => () => {

        if(userId == null) return;
        if(currentSprint == null) return;

        var subTaskId = (value + 1) + "-" + task.taskEntityId;
        console.log(subTaskId)

        var subtask = task.subTasks.find(s => s.subTaskEntityId == subTaskId);

        if(subtask == undefined) return;

        var newSubTask = {...subtask};
        
        if(newSubTask == null) return;

        

        if(newSubTask.status == "Incomplete") {
            newSubTask.status = "Completed";
        } else {
            newSubTask.status = "Incomplete";
        }
        console.log(subtask)
        dispatch(updateSubtaskStateAsync({userId: userId, sprintId: currentSprint, taskId: task.taskEntityId, subtaskId: subTaskId, updatedSubtask: newSubTask}))

    };

    const handleNewSubtask = (data: FieldValues) => {

        if(userId == null) return;
        if(currentSprint == null) return;

        var newSubtask = {
            subTaskEntityId: (task.subTasks.length + 1) + "-" + task.taskEntityId,
            status: "Incomplete",
            details: newSubTaskValue
        }

        if(newSubTaskValue === "") {
            setNewSubTask(false);
            setNewSubTaskValue("");
            return;
        }

        console.log(newSubtask);

        setNewSubTask(false);
        setNewSubTaskValue("");

        dispatch(addSubTaskToTaskAsync({userId: userId, sprintId: currentSprint, taskId: task.taskEntityId, newSubtask: newSubtask}))
            .catch((error) => {console.log(error); toast.error("Failed to create task")});


    }

    const addTaskBorders = task.subTasks.length > 0 ? '0 0 5px 5px' : '5px';

    return (
        <>
            <List dense sx={{ width: '100%', borderRadius: '5px' }} subheader={!isDialog && <ListSubheader sx={{backgroundColor: 'rgba(256, 256, 256, 0)'}}>Subtasks</ListSubheader>}>  
            {task.subTasks.map((subTask, index) => {
                const labelId = `checkbox-list-secondary-label-${index}`;
                return (
                <div key={index + 'div'}>
                    <ListItem
                        key={subTask.subTaskEntityId}
                        sx={{backgroundColor: 'rgba(256, 256, 256, 1)', borderRadius: task.subTasks.length === 1 ? '5px 5px 0px 0px' : index === 0 ? '5px 5px 0 0'  : ''}}
                        secondaryAction={
                        <Checkbox
                            key={subTask.subTaskEntityId + '-checkbox'}
                            edge="end"
                            checked={subTask.status === "Completed"}
                            onChange={handleSubtaskState(index)}
                            sx ={{
                                color: 'grey',
                                '&.Mui-checked': {
                                color: 'rgba(30,177,121,1)',
                                },
                            }}
                        />
                        }
                        disablePadding
                    >
                        <CircleIcon key={subTask.subTaskEntityId + '-icon'} sx={{fontSize: '10px', ml: "10px"}} color={subTask.status === "Completed" ? "success" : "error"} />
                        <ListItemButton key={subTask.subTaskEntityId + '-listItemButton'}>
                            <ListItemText key={subTask.subTaskEntityId + '-listItemText'} id={labelId} primary={subTask.details} sx={{ my: 0 }} />
                        </ListItemButton>
                    </ListItem>
                    {index !== task.subTasks.length - 1 &&
                        <Divider sx={{backgroundColor: '#DDDDDD'}} key={subTask.subTaskEntityId + '-divider'} />
                    }
                </div>
                );
            })}
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit((data) => {handleNewSubtask(data)})}>
                    {newSubTask && 
                    <ListItem
                            sx={{backgroundColor: 'rgba(256, 256, 256, 0.4)', borderRadius: addTaskBorders}}
                            disablePadding
                        >
                        <CircleIcon sx={{fontSize: '10px', ml: "10px", color: '#888888'}}/>
                        <AddSubtaskTextField control={control} name="newSubtask" setNewSubTaskValue={setNewSubTaskValue} newSubTaskValue={newSubTaskValue}/>
                        <IconButton type="submit" sx={{margin: 'auto', padding: '1px', marginRight:'14px', marginLeft:'14px'}} size="small" ><AddCircleIcon sx={{fontSize: '20px'}} /></IconButton>
                    </ListItem>
                    }
                    {!newSubTask && 
                        <ListItem sx={{backgroundColor: 'rgba(256, 256, 256, 0.4)', borderRadius: addTaskBorders}}>
                            <Box sx={{ marginRight: '5px', textAlign:'center'}} flexGrow={1} >
                                    <IconButton sx={{margin: 'auto', padding: '1px'}} size="small" onClick={(event) => {setNewSubTask(true)}}><AddCircleIcon sx={{fontSize: '20px'}} /></IconButton>   
                            </Box>
                        </ListItem>
                    }
                </form>
            </FormProvider>

        </List> 
        </>

    )
}