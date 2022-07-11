import { Box, Fade, Grow, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Task } from "../../app/models/task";
import NewTaskButton from "./NewTaskButton";
import TaskCardView from "./TaskCardView";
import TaskCardViewEditor from "./TaskCardViewEditor";


interface Props {
    tasks: Task[],
    stateTitle: String,
    sprintId: string,
    tasksToBeEdited: string[],
    toggleEditTask: (taskId: string) => void
}

export default function TaskColumnView({tasks, stateTitle, sprintId, toggleEditTask, tasksToBeEdited}: Props) {

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

            
            <Typography variant='h4' sx={{fontWeight: '700', color: 'white'}}>{stateTitle}</Typography>

            {tasks.map((task, index) => (
                !tasksToBeEdited.includes(task.taskEntityId) ? 
                    <TaskCardView task={task} key={task.taskEntityId + index + sprintId} toggleEditTask={toggleEditTask} indexForAnimation={index} />
                        :
                    <TaskCardViewEditor toggleEditTask={toggleEditTask} key={task.taskEntityId + index + sprintId} setNewTask={setNewTask} editTask={task}/>
            ))}

            {newTask && <TaskCardViewEditor setNewTask={setNewTask} toggleEditTask={toggleEditTask}/>}

            {stateTitle === "New" && !newTask && <NewTaskButton addNewTaskOnClick={handleNewTask}/>}
        </Box>
    )
}