import { Box, CircularProgress, Grid, Paper } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { Task } from "../../app/models/task";
import TaskColumnView from "./TaskColumnView";


// "{tasks}: Props" destructures the props for the fields inside
export default function SprintView() {

    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:5000/api/tasks')
            .then(response => setTasks(response.data))
            .catch(error => console.log(error))
            .finally(() => setLoading(false));
    }, [])

    if (loading) return <CircularProgress color="secondary" />

    if (!tasks) return <h3>Error! Tasks not found.</h3>

    return (
        <>
        <Box sx={{ flexGrow: 1}}>
            <Grid container 
                spacing={1}
                >
                <Grid item xs={4}>
                    <TaskColumnView tasks={tasks.filter((task) => {
                        return task.currentState === 0;
                    })} />
                </Grid>
                <Grid item xs={4}>
                    <TaskColumnView tasks={tasks.filter((task) => {
                        return task.currentState === 1;
                    })} />
                </Grid>
                <Grid item xs={4}>
                    <TaskColumnView tasks={tasks.filter((task) => {
                        return task.currentState === 2;
                    })} />
                </Grid>
            </Grid>
        </Box>
        
            
        </>
        
    )
}