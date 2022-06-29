import { Avatar, Checkbox, Divider, List, ListItem, ListItemAvatar, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Typography } from "@mui/material";
import { useState } from "react";
import { Task } from "../../app/models/task";
import CircleIcon from '@mui/icons-material/Circle';

interface Props {
    task: Task
}

export default function SubTasksView({task}: Props) {

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
            <List dense sx={{ width: '100%', borderRadius: '5px', backgroundColor: 'rgba(256, 256, 256, 1)' }} subheader={<ListSubheader sx={{backgroundColor: 'rgba(256, 256, 256, 0)'}}>Subtasks</ListSubheader>}>
            <Divider />
            {task.subTasks.map((subTask, index) => {
                const labelId = `checkbox-list-secondary-label-${index}`;
                return (
                <>
                    <ListItem
                        key={index}
                        sx={{backgroundColor: 'rgba(256, 256, 256, 0)'}}
                        secondaryAction={
                        <Checkbox
                            edge="end"
                            onChange={handleToggle(index)}
                            checked={checked.indexOf(index) !== -1}
                            inputProps={{ 'aria-labelledby': labelId }}
                        />
                        }
                        disablePadding
                    >
                        <CircleIcon sx={{fontSize: '10px', ml: "10px"}} color={subTask.status === "completed" ? "success" : "error"} />
                        <ListItemButton>
                            <ListItemText id={labelId} primary={subTask.details} sx={{ my: 0 }} />
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                </>
                );
            })}
            </List> 
        </>
        // {task.subTasks.map((subTask, index) => (
        // ))}
    )
}