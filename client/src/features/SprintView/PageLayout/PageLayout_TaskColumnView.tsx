import { Card, Typography, useTheme } from "@mui/material";
import { Task } from "app/models/task";
import { useState, useEffect, Fragment } from "react";
import NewEditTaskCard from "../NewEditTask/NewEditTask_Card";
import ViewTaskCard from "../ViewTask/ViewTask_Card";
import PageLayoutNewTaskButton from "./PageLayout_NewTaskButton";



interface Props {
    tasks: Task[],
    stateTitle: String,
    sprintId: string,
    tasksToBeEdited: string[],
    toggleEditTask: (taskId: string) => void
}

export default function PageLayoutTaskColumnView({tasks, stateTitle, sprintId, toggleEditTask, tasksToBeEdited}: Props) {

    // react state and theme
    const [newTask, setNewTask] = useState<boolean>(false);
    const theme = useTheme();

    // default value of new task set to false upon sprintId being changed
    useEffect(() => {
        setNewTask(false)
    }, [sprintId])

    // handle new task button selected
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
                    (<ViewTaskCard task={task} key={"Task" + task.taskEntityId + index + sprintId} toggleEditTask={toggleEditTask} indexForAnimation={index} />)
                        :
                    (<NewEditTaskCard toggleEditTask={toggleEditTask} key={"Editor" + task.taskEntityId + index + sprintId} setNewTask={setNewTask} editTask={task}/>)}

                    {(index === tasks.length - 1) && stateTitle === "New" && !newTask && <PageLayoutNewTaskButton key={"NewTaskButton" + task.taskEntityId + index + sprintId} addNewTaskOnClick={handleNewTask} index={tasks.length}/>} 

                    {(index === tasks.length - 1) && newTask && <NewEditTaskCard key={"NewTask" + task.taskEntityId + index + sprintId} setNewTask={setNewTask} toggleEditTask={toggleEditTask}/>}  
                </Fragment>
                  
            ))}

            {/* Apparent redundancy below is for consistency of animation purposes */}

            {tasks.length === 0 && stateTitle === "New" && !newTask && <PageLayoutNewTaskButton addNewTaskOnClick={handleNewTask} index={tasks.length}/>}   

            {tasks.length === 0 && newTask && <NewEditTaskCard setNewTask={setNewTask} toggleEditTask={toggleEditTask}/>}  
            
        </>
    )
}