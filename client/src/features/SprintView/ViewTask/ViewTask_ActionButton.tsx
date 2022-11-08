import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import { removeTaskFromSprintAsync, changeTaskSprintAsync } from "app/state/userSlice";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { Task } from "app/models/task";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";

interface Props {
    task: Task,
    toggleEditTask: (taskId: string) => void,
    setZoom: (value: boolean) => void,
    setMoveSprint: (value: boolean) => void
}

export default function ViewTaskActionButton({task, toggleEditTask, setZoom, setMoveSprint}: Props) {


    const {currentSprint, isExpanded: expanded, currentBoard } = useAppSelector(state => state.sprintView);
    const userEntityId = useAppSelector(state => state.user.userData?.userEntityId);
    const dispatch = useAppDispatch();

    const deleteTask = () => {
        dispatch(removeTaskFromSprintAsync({userId: userEntityId || "", boardId: currentBoard || "", sprintId: currentSprint || "", taskId: task.taskEntityId}));
    }

    const editTask = async () => {
        setZoom(false);
        await new Promise<void>(done => setTimeout(() => done(), 300));
        toggleEditTask(task.taskEntityId);
    }


    return (
        
      <ToggleButtonGroup
        sx={{backgroundColor:'white'}}
        exclusive
        aria-label="text alignment"
      >
            <ToggleButton value={"changeSprint"} aria-label="left aligned" onClick={() => setMoveSprint(true)}>
                <DateRangeIcon sx={{color: 'grey.600'}} />
            </ToggleButton>
            <ToggleButton value={"edit"} aria-label="left aligned" onClick={editTask}>
                <EditIcon sx={{color: 'grey.600'}}/>
            </ToggleButton>
            <ToggleButton value={"delete"} aria-label="left aligned" onClick={deleteTask}>
                <DeleteIcon sx={{color: '#D33216'}} />
            </ToggleButton>
        </ToggleButtonGroup>
    )
}
