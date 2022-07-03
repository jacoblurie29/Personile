import { Checkbox, Divider, List, ListItem, ListItemButton, ListItemText, ListSubheader, Typography } from "@mui/material";
import { useState } from "react";
import { Task } from "../../app/models/task";
import CircleIcon from '@mui/icons-material/Circle';
import LoadingComponent from "../../app/layout/LoadingComponent";

interface Props {
    task: Task,
    isDialog: boolean
}

export default function SubTasksView({task, isDialog}: Props) {

    const [checked, setChecked] = useState([1]);

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
        newChecked.push(value);
        } else {
        newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };


    return (
        <>
            <List dense sx={{ width: '100%', borderRadius: '5px', backgroundColor: 'rgba(256, 256, 256, 1)' }} subheader={!isDialog && <ListSubheader sx={{backgroundColor: 'rgba(256, 256, 256, 0)'}}>Subtasks</ListSubheader>}>
            <Divider />        
            {task.subTasks.map((subTask, index) => {
                const labelId = `checkbox-list-secondary-label-${index}`;
                return (
                <div key={index + 'div'}>
                    <ListItem
                        key={subTask.subTaskEntityId}
                        sx={{backgroundColor: 'rgba(256, 256, 256, 0)'}}
                        secondaryAction={
                        <Checkbox
                            key={subTask.subTaskEntityId + '-checkbox'}
                            edge="end"
                            onChange={handleToggle(index)}
                            checked={checked.indexOf(index) !== -1}
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
                    <Divider key={subTask.subTaskEntityId + '-divider'} />
                </div>
                );
            })}
            </List> 
        </>

    )
}