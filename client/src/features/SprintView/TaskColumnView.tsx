import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Task } from "../../app/models/task";
import NewTaskButton from "./NewTaskButton";
import TaskCardView from "./TaskCardView";
import NewTaskCardView from "./NewTaskCardView";


interface Props {
    tasks: Task[],
    stateTitle: String,
    sprintId: string
}

export default function TaskColumnView({tasks, stateTitle, sprintId}: Props) {

    const [newTask, setNewTask] = useState<boolean>(false);

    useEffect(() => {
        setNewTask(false)
    }, [sprintId])

    const handleNewTask = () => {
        setNewTask(true)
    }

    // const handleCloseNewTask = () => {
    //     setNewTask(false)
    // }

    return (
        <Box sx={{height: '100%', pr: '10px'}} margin='5px'>
            <>
            { /* Might want to abstract the card in the future */ }
            <Typography variant='h4' sx={{fontWeight: '700', color: 'white'}}>{stateTitle}</Typography>
            {tasks.map((task, index) => (
                <TaskCardView task={task} key={task.taskEntityId + index + sprintId} />
            ))}
            {newTask && <NewTaskCardView setNewTask={setNewTask} />}
            {stateTitle === "New" && !newTask && <NewTaskButton addNewTaskOnClick={handleNewTask}/>}
            </>
        </Box>
    )
}