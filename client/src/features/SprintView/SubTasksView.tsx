import { Box, Button, Checkbox, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, ListSubheader, TextField, Typography } from "@mui/material";
import { Task } from "../../app/models/task";
import CircleIcon from '@mui/icons-material/Circle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import AddSubtaskTextField from "./AddSubtaskTextField";

interface Props {
    task: Task,
    isDialog: boolean
}

export default function SubTasksView({task, isDialog}: Props) {

    const methods = useForm();

    const { control, handleSubmit } = useForm();

    const [newSubTask, setNewSubTask] = useState<boolean>(false);

    const handleToggle = (value: number) => () => {
        // Update redux and database to reflect checked state
    };

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
                        sx={{backgroundColor: 'rgba(256, 256, 256, 1)', borderRadius: task.subTasks.length === 1 ? '5px 5px 5px 5px' : index === 0 ? '5px 5px 0 0'  : ''}}
                        secondaryAction={
                        <Checkbox
                            key={subTask.subTaskEntityId + '-checkbox'}
                            edge="end"
                            onChange={handleToggle(index)}
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                        }
                        disablePadding
                    >
                        <CircleIcon key={subTask.subTaskEntityId + '-icon'} sx={{fontSize: '10px', ml: "10px"}} color={subTask.status === "completed" ? "success" : "error"} />
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
            <>
            {newSubTask && 
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit((data) => console.log(data))}>
                    <ListItem
                            sx={{backgroundColor: 'rgba(256, 256, 256, 0.4)', borderRadius: addTaskBorders}}
                            disablePadding
                        >
                        <CircleIcon sx={{fontSize: '10px', ml: "10px", color: '#888888'}}/>
                        <AddSubtaskTextField control={control} name="newSubtask"/>
                        <IconButton type="submit" sx={{margin: 'auto', padding: '1px', marginRight:'14px', marginLeft:'14px'}} size="small" onClick={() => setNewSubTask(false)}><AddCircleIcon sx={{fontSize: '20px'}} /></IconButton>
                    </ListItem>
                </form>
            </FormProvider>
            }
            {!newSubTask &&
            <ListItem sx={{backgroundColor: 'rgba(256, 256, 256, 0.4)', borderRadius: addTaskBorders}}>
                <Box sx={{ marginRight: '5px', textAlign:'center'}} flexGrow={1} >
                        <IconButton type="button" sx={{margin: 'auto', padding: '1px'}} size="small" onClick={() => setNewSubTask(true)}><AddCircleIcon sx={{fontSize: '20px'}} /></IconButton>   
                </Box>
            </ListItem>
            }
            </>
        </List> 
        </>

    )
}