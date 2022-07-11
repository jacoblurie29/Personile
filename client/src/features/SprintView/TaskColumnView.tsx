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
                <div key={task.taskEntityId + index + sprintId}>
                {!tasksToBeEdited.includes(task.taskEntityId) ? 
                    (<TaskCardView task={task} key={task.taskEntityId + index + sprintId} toggleEditTask={toggleEditTask} indexForAnimation={index} />)
                        :
                    (<TaskCardViewEditor toggleEditTask={toggleEditTask} key={task.taskEntityId + index + sprintId} setNewTask={setNewTask} editTask={task}/>)}

                    {(index === tasks.length - 1) && stateTitle === "New" && !newTask && <NewTaskButton key={task.taskEntityId + index + sprintId} addNewTaskOnClick={handleNewTask} index={tasks.length}/>} 

                    {(index === tasks.length - 1) && newTask && <TaskCardViewEditor key={task.taskEntityId + index + sprintId} setNewTask={setNewTask} toggleEditTask={toggleEditTask}/>}  
                </div>
                  
            ))}

            {/* Below redundancy is for consistency of animation purposes */}

            {tasks.length === 0 && stateTitle === "New" && !newTask && <NewTaskButton addNewTaskOnClick={handleNewTask} index={tasks.length}/>}   

            {tasks.length === 0 && newTask && <TaskCardViewEditor setNewTask={setNewTask} toggleEditTask={toggleEditTask}/>}  
            
            

            
        </Box>
    )
}