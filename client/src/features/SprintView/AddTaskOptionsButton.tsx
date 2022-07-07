import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import NewTaskButton from "./NewTaskButton";

interface Props {
    setNewTask: (value: boolean) => void
}

export default function AddTaskOptionsButton({setNewTask}: Props) {

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
            <ToggleButton value="new" aria-label="left aligned" onClick={() => setNewTask(false)}>
            <DeleteIcon color="error"/>
            </ToggleButton>
            <ToggleButton value="active" aria-label="centered" type="submit">
            <AddCircleIcon color="success"/>
            </ToggleButton>
      </ToggleButtonGroup>
    )
}