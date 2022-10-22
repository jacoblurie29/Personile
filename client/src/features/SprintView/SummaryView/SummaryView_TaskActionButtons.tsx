import { ToggleButtonGroup, ToggleButton, Grid } from "@mui/material";
import { Task } from "app/models/task";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

interface Props {
    task: Task
}

export default function TaskActionButtons () {

    // Stops the accordian from opening due to the click in the summary area
    const onClickDelete = (event: any) => {
        event.stopPropagation();
    }

    return (
        <Grid container display='flex' justifyContent="right" flexGrow={1} sx={{padding: '5px'}} >
            <Grid item lg={8} sm= {6}
                    display="flex" 
                    alignItems="center"
                    justifyContent="right">
                <ToggleButtonGroup
                sx={{backgroundColor:'white'}}
                exclusive
                aria-label="text alignment"
            >
                    <ToggleButton value="completed" aria-label="right aligned" onClick={onClickDelete}>
                        <KeyboardArrowUpIcon />
                    </ToggleButton>
                    <ToggleButton value="completed" aria-label="right aligned" onClick={onClickDelete}>
                        <KeyboardArrowDownIcon />
                    </ToggleButton>
            </ToggleButtonGroup>
        </Grid>
      </Grid>

    )
}