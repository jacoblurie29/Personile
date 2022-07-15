import { Card, Typography, useTheme } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
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
    const theme = useTheme();

    useEffect(() => {
        setNewTask(false)
    }, [sprintId])

    const handleNewTask = () => {
        setNewTask(true)
    }

    return (
        <>

            <Card sx={{borderRadius: '5px 5px 0 0', background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`}}>
            <Typography variant='h2' sx={{fontWeight: '700', color: 'white', padding: '15px'}}>{stateTitle}</Typography>
            </Card>

            {tasks.map((task, index) => (
                <Fragment key={"Fragment" + task.taskEntityId + index + sprintId}>
                {!tasksToBeEdited.includes(task.taskEntityId) ? 
                    (<TaskCardView task={task} key={"Task" + task.taskEntityId + index + sprintId} toggleEditTask={toggleEditTask} indexForAnimation={index} />)
                        :
                    (<TaskCardViewEditor toggleEditTask={toggleEditTask} key={"Editor" + task.taskEntityId + index + sprintId} setNewTask={setNewTask} editTask={task}/>)}

                    {(index === tasks.length - 1) && stateTitle === "New" && !newTask && <NewTaskButton key={"NewTaskButton" + task.taskEntityId + index + sprintId} addNewTaskOnClick={handleNewTask} index={tasks.length}/>} 

                    {(index === tasks.length - 1) && newTask && <TaskCardViewEditor key={"NewTask" + task.taskEntityId + index + sprintId} setNewTask={setNewTask} toggleEditTask={toggleEditTask}/>}  
                </Fragment>
                  
            ))}

            {/* Below redundancy is for consistency of animation purposes */}

            {tasks.length === 0 && stateTitle === "New" && !newTask && <NewTaskButton addNewTaskOnClick={handleNewTask} index={tasks.length}/>}   

            {tasks.length === 0 && newTask && <TaskCardViewEditor setNewTask={setNewTask} toggleEditTask={toggleEditTask}/>}  
            
        </>
    )
}