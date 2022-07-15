import { Box, Checkbox, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader } from "@mui/material";
import { Task } from "../../app/models/task";
import CircleIcon from '@mui/icons-material/Circle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import AddSubtaskTextField from "./AddSubtaskTextField";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { addSubTaskToTaskAsync, removeSubtaskFromTaskAsync, updateSubtaskAsync } from "app/state/userSlice";
import { toast } from "react-toastify";
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import EditSubtaskTextField from "./EditSubtaskTextField";
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
    task: Task,
    isDialog: boolean
}

export default function SubTasksView({task, isDialog}: Props) {

    const methods = useForm();

    const { control, handleSubmit } = useForm();

    const [newSubTask, setNewSubTask] = useState<boolean>(false);
    const [newSubTaskValue, setNewSubTaskValue] = useState<string>("");
    const [isEditSubtask, setIsEditSubtask] = useState<string>("");
    const [editSubtaskValue, setEditSubtaskValue] = useState<string>("");

    const dispatch = useAppDispatch();
    const { currentSprint, currentBoard } = useAppSelector(state => state.sprintView);
    const userId = useAppSelector(state => state.user.userData?.userEntityId);

    const handleSubtaskState = (value: number) => () => {

        if(userId == null) return;
        if(currentSprint == null) return;
        if(currentBoard == null) return;

        var subTaskId = (value + 1) + "-" + task.taskEntityId;

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
        dispatch(updateSubtaskAsync({userId: userId, boardId: currentBoard, sprintId: currentSprint, taskId: task.taskEntityId, subtaskId: subTaskId, updatedSubtask: newSubTask}))

    };

    const handleNewSubtask = (data: FieldValues) => {
        
        console.log(data);

        if(userId == null) return;
        if(currentSprint == null) return;
        if(currentBoard == null) return;

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

        dispatch(addSubTaskToTaskAsync({userId: userId, boardId: currentBoard, sprintId: currentSprint, taskId: task.taskEntityId, newSubtask: newSubtask}))
            .catch((error) => {console.log(error); toast.error("Failed to create task")});


    }

    const handleEditSubtaskToggle = (subtaskId: string) => {
        if(isEditSubtask !== subtaskId) {
            setEditSubtaskValue(task.subTasks.find(s => s.subTaskEntityId === subtaskId)?.details || "")
            setIsEditSubtask(subtaskId);
        } else if (isEditSubtask === subtaskId) {
            setIsEditSubtask("");
        }
    }

    const handleUpdateSubtask = (updateSubtaskId: string) => {

        if(userId == null) return;
        if(currentSprint == null) return;
        if(currentBoard == null) return;

        var subtask = task.subTasks.find(s => s.subTaskEntityId == updateSubtaskId);

        if(subtask == undefined) return;

        var newSubTask = {...subtask};
        
        if(newSubTask == null) return;

        newSubTask.details = editSubtaskValue;

        console.log(newSubTask);

        setEditSubtaskValue("");
        setIsEditSubtask("");

        dispatch(updateSubtaskAsync({userId: userId, boardId: currentBoard, sprintId: currentSprint, taskId: task.taskEntityId, subtaskId: updateSubtaskId, updatedSubtask: newSubTask}))
            .catch((error) => {console.log(error); toast.error("Failed to update subtask")});

    }

    const cancelEditSubtask = () => {
        setEditSubtaskValue("");
        setIsEditSubtask("");
    }

    const deleteSubtask = (deleteSubtaskId: string) => {
        if(userId == null) return;
        if(currentSprint == null) return;
        if(currentBoard == null) return;

        var subtask = task.subTasks.find(s => s.subTaskEntityId == deleteSubtaskId);

        if(subtask == undefined) return;

        dispatch(removeSubtaskFromTaskAsync({userId: userId, boardId: currentBoard, sprintId: currentSprint, taskId: task.taskEntityId, subtaskId: subtask.subTaskEntityId}))
            .catch((error) => {console.log(error); toast.error("Failed to delete subtask")});
    }

    const addTaskBorders = task.subTasks.length > 0 ? '0 0 5px 5px' : '5px';

    const getEditTaskBorders = (index: number) => {
        if(index === 0 && task.subTasks.length > 1) return '5px 5px 0 0';
        if(index === 0 && task.subTasks.length <= 1) return '5px';
        if(index !== 0 && task.subTasks.length === index) return '0 0 5px 5px';
        return '0px';
    }

    return (
        <>
            <List dense sx={{ width: '100%', borderRadius: '5px', }} subheader={!isDialog && <ListSubheader sx={{backgroundColor: 'rgba(256, 256, 256, 0)'}}>Subtasks</ListSubheader>}>  
            {task.subTasks.map((subTask, index) => {
                const labelId = `checkbox-list-secondary-label-${index}`;
                return (
                <div key={index + 'div'}>
                    {!isEditSubtask.includes(subTask.subTaskEntityId) && 
                    <ListItem
                        key={subTask.subTaskEntityId}
                        sx={{backgroundColor: subTask.status === "Completed" ? 'success.light' : 'error.light', borderRadius: task.subTasks.length === 1 ? '5px 5px 0px 0px' : index === 0 ? '5px 5px 0 0'  : ''}}
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
                        <CircleIcon key={subTask.subTaskEntityId + '-icon'} sx={{fontSize: '10px', ml: "10px", color: subTask.status === "Completed" ? "success.main" : "error.main"}} />
                        <ListItemButton key={subTask.subTaskEntityId + '-listItemButton'} onClick={() => {handleEditSubtaskToggle(subTask.subTaskEntityId)}} >
                            <ListItemText key={subTask.subTaskEntityId + '-listItemText'} id={labelId} primary={subTask.details} sx={{ my: 0 }}  />
                        </ListItemButton>
                    </ListItem>
                    }
                    {isEditSubtask.includes(subTask.subTaskEntityId) && 
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit((data) => {handleUpdateSubtask(subTask.subTaskEntityId)})}>
                            <ListItem
                                    sx={{backgroundColor: subTask.status === "Completed" ? 'success.light' : 'error.light', borderRadius: getEditTaskBorders(index)}}
                                    disablePadding
                                >
                                <CircleIcon sx={{fontSize: '10px', ml: "10px", color: subTask.status === "Completed" ? "success.main" : "error.main"}}/>
                                    <EditSubtaskTextField control={control} name="editSubtask" setEditSubTaskValue={setEditSubtaskValue} editSubTaskValue={editSubtaskValue}/>
                                <IconButton type="submit" sx={{margin: 'auto', padding: '1px',marginLeft:'6px'}} size="small" ><PublishedWithChangesIcon sx={{fontSize: '20px'}} /></IconButton>
                                <IconButton sx={{margin: 'auto', padding: '1px', marginLeft: '2px', marginRight: '2px' }} onClick={() => deleteSubtask(subTask.subTaskEntityId)} size="small" ><DeleteIcon sx={{fontSize: '20px'}} /></IconButton>
                                <IconButton sx={{margin: 'auto', padding: '1px', marginRight:'6px'}} size="small" onClick={cancelEditSubtask} ><ClearIcon sx={{fontSize: '20px'}} /></IconButton>
                            </ListItem>
                        </form>
                    </FormProvider>
                    }
                    {index !== task.subTasks.length - 1 &&
                        <Divider sx={{backgroundColor: 'grey.50'}} key={subTask.subTaskEntityId + '-divider'} />
                    }
                </div>
                );
            })}
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit((data) => {handleNewSubtask(data)})}>
                    {newSubTask && 
                    <ListItem
                            sx={{backgroundColor: 'grey.50', borderRadius: addTaskBorders}}
                            disablePadding
                        >
                        <CircleIcon sx={{fontSize: '10px', ml: "10px", color: '#888888'}}/>
                            <AddSubtaskTextField control={control} name="newSubtask" setNewSubTaskValue={setNewSubTaskValue} newSubTaskValue={newSubTaskValue}/>
                        <IconButton type="submit" sx={{margin: 'auto', padding: '1px', marginRight:'14px', marginLeft:'14px'}} size="small" ><AddCircleIcon sx={{fontSize: '20px'}} /></IconButton>
                    </ListItem>
                    }
                    {!newSubTask && 
                        <ListItem sx={{backgroundColor: 'grey.50', borderRadius: addTaskBorders}}>
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