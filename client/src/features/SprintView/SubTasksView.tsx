import { Checkbox, Divider, List, ListItem, ListItemButton, ListItemText, ListSubheader } from "@mui/material";
import { Task } from "../../app/models/task";
import CircleIcon from '@mui/icons-material/Circle';

interface Props {
    task: Task,
    isDialog: boolean
}

export default function SubTasksView({task, isDialog}: Props) {



    const handleToggle = (value: number) => () => {
        // Update redux and database to reflect checked state
    };


    return (
        <>
            <List dense sx={{ width: '100%', borderRadius: '5px' }} subheader={!isDialog && <ListSubheader sx={{backgroundColor: 'rgba(256, 256, 256, 0)'}}>Subtasks</ListSubheader>}>  
            {task.subTasks.map((subTask, index) => {
                const labelId = `checkbox-list-secondary-label-${index}`;
                return (
                <div key={index + 'div'}>
                    <ListItem
                        key={subTask.subTaskEntityId}
                        sx={{backgroundColor: 'rgba(256, 256, 256, 1)', borderRadius: task.subTasks.length === 1 ? '5px 5px 5px 5px' : index === 0 ? '5px 5px 0 0' : index === task.subTasks.length - 1 ? '0 0 5px 5px' : ''}}
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
            </List> 
        </>

    )
}