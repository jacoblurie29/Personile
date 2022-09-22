import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Task } from "app/models/task";

interface Props {
    setNewTask: (value: boolean) => void,
    toggleEditTask: (taskId: string) => void,
    task?: Task,
    isEdit: boolean
}

export default function NewEditTaskOptionsButton({setNewTask, isEdit, task, toggleEditTask}: Props) {

    const [alignment, setAlignment] = useState<string | null>('left');

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string | null,
    ) => {
        setAlignment(newAlignment);
    };

    return (
      <ToggleButtonGroup
        sx={{backgroundColor:'#EEEEEE'}}
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
        {isEdit ?
            <ToggleButton value="new" sx={{background: 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)', ":hover": {background: "error.dark"}}} aria-label="left aligned" onClick={() => setNewTask(false)}>
              <DeleteIcon sx={{color:"background.paper"}}/>
            </ToggleButton> :
            <ToggleButton value="new" sx={{background: 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)', ":hover": {background: "error.dark"}}} aria-label="left aligned" onClick={() => toggleEditTask(task?.taskEntityId!)}>
             <ArrowBackIcon sx={{color:"background.paper"}} />
            </ToggleButton>
          } 
            <ToggleButton value="active" aria-label="centered" type="submit" sx={{background: 'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)', ":hover": {backgroundColor: "success.dark"}}}>
            {isEdit ? <AddCircleIcon sx={{color:"background.paper"}}/> : <CheckCircleIcon sx={{color:"background.paper"}} />}
            </ToggleButton>
      </ToggleButtonGroup>
    )
}