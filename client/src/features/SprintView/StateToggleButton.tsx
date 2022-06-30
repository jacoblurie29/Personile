import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { useState } from "react";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface Props {
    startingState: number
}

export default function StateToggleButton({startingState} : Props) {

    const [alignment, setAlignment] = useState<string | null>('left');

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string | null,
    ) => {
        setAlignment(newAlignment);
    };

    return (
      <ToggleButtonGroup
        sx={{backgroundColor:'white'}}
        value={alignment}
        exclusive
        onChange={handleAlignment}
        aria-label="text alignment"
      >
            <ToggleButton value="new" aria-label="left aligned" selected={startingState === 0}>
            <HighlightOffIcon color="error"/>
            </ToggleButton>
            <ToggleButton value="active" aria-label="centered" selected={startingState === 1}>
            <PunchClockIcon color="warning"/>
            </ToggleButton>
            <ToggleButton value="copmleted" aria-label="right aligned" selected={startingState === 2}>
            <CheckCircleOutlineIcon color="success" />
            </ToggleButton>
      </ToggleButtonGroup>
    )
}