import { ToggleButtonGroup, ToggleButton, Grid } from "@mui/material";
import { Task } from "app/models/task";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAppSelector } from "app/store/configureStore";

interface Props {
    task: Task,
    sprintId: string,
    handleMoveTask: (taskId: string, sprintId: string, oldOrderLocation: number, newOrderLocation: number) => void,
    index: number,
    max: number
}

export default function TaskActionButtons ({handleMoveTask, task, sprintId, index, max}: Props) {

    // Stops the accordian from opening due to the click in the summary area
    const onClickDelete = (event: any) => {
        event.stopPropagation();
    }

    const { currentSprint } = useAppSelector(state => state.sprintView);
    const status = useAppSelector(state => state.user.status);

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
                    <ToggleButton disabled={index == 0 || status.includes("pending")} value="completed" aria-label="right aligned" onClick={(event) => {onClickDelete(event); handleMoveTask(task.taskEntityId, sprintId, task.order, task.order - 1);}}>
                        <KeyboardArrowUpIcon />
                    </ToggleButton>
                    <ToggleButton disabled={index == max || status.includes("pending")} value="completed" aria-label="right aligned" onClick={(event) => {onClickDelete(event); handleMoveTask(task.taskEntityId, sprintId, task.order, task.order + 1);}}>
                        <KeyboardArrowDownIcon />
                    </ToggleButton>
            </ToggleButtonGroup>
        </Grid>
      </Grid>

    )
}