import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import NewTaskButton from "./NewTaskButton";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Task } from "app/models/task";

interface Props {
    setNewTask: (value: boolean) => void,
    toggleEditTask: (taskId: string) => void,
    task?: Task,
    isEdit: boolean
}

export default function AddTaskOptionsButton({setNewTask, isEdit, task, toggleEditTask}: Props) {

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
            <ToggleButton value="new" aria-label="left aligned" onClick={() => setNewTask(false)}>
              <DeleteIcon color="error"/>
            </ToggleButton> :
            <ToggleButton value="new" aria-label="left aligned" onClick={() => toggleEditTask(task?.taskEntityId!)}>
             <ArrowBackIcon color="error" />
            </ToggleButton>
          } 
            <ToggleButton value="active" aria-label="centered" type="submit">
            {isEdit ? <AddCircleIcon color="success"/> : <CheckCircleIcon color="success" />}
            </ToggleButton>
      </ToggleButtonGroup>
    )
}