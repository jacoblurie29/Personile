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

    const calculatePreviousTaskOrderNumber = (taskEntityId: string) => {
        var index = tasks.findIndex(t => t.taskEntityId == taskEntityId);
        if(index == 0) {
            return 0;
        } else {
            return tasks[index - 1].order;
        }
    }

    const calculateNextTaskOrderNumber = (taskEntityId: string) => {
        var index = tasks.findIndex(t => t.taskEntityId == taskEntityId);
        if(index == tasks.length - 1) {
            return tasks.length - 1;
        } else {
            return tasks[index + 1].order;
        }
    }

    return (
        <>
            <Card elevation={0} sx={{borderRadius: '25px 25px 0 0', backgroundColor: `primary.main`, border: '1px solid', borderColor: 'grey.400'}}>
                <Typography variant='h2' sx={{fontWeight: '700', color: 'grey.50', padding: '15px'}}>{stateTitle}</Typography>
            </Card>

            {tasks.map((task, index) => (
                <Fragment key={"Fragment" + task.taskEntityId + index + sprintId}>
                {!tasksToBeEdited.includes(task.taskEntityId) ? 
                    (<ViewTaskCard task={task} sprintId={sprintId} key={"Task" + task.taskEntityId + index + sprintId} toggleEditTask={toggleEditTask} indexForAnimation={index} index={index} max={tasks.length - 1} previousIndex={calculatePreviousTaskOrderNumber(task.taskEntityId)} nextIndex={calculateNextTaskOrderNumber(task.taskEntityId)} />)
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