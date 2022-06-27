import { Box, Grid, Paper } from "@mui/material";
import { Task } from "../../app/models/task";
import TaskColumnView from "./TaskColumnView";

// Interface defines parameter types of what is being passed down from parent so they can be destructured
interface Props {
    tasks: Task[];
}

// "{tasks}: Props" destructures the props for the fields inside
export default function SprintView({tasks}: Props) {

    return (
        <>
        <Box sx={{ flexGrow: 1}}>
            <Grid container 
                spacing={2}
                >
                <Grid container item xs={3}>
                    <TaskColumnView tasks={tasks.filter((task) => {
                        return task.currentState === 0;
                    })} />
                </Grid>
                <Grid container item xs={3}>
                    <TaskColumnView tasks={tasks.filter((task) => {
                        return task.currentState === 1;
                    })} />
                </Grid>
                <Grid container item xs={3}>
                    <TaskColumnView tasks={tasks.filter((task) => {
                        return task.currentState === 2;
                    })} />
                </Grid>
                <Grid container item xs={3}>
                    {/* Below will go the widget component*/}
                    <Box sx={{width: "100%", height: "100%"}} />
                </Grid>
            </Grid>
        </Box>
        
            
        </>
        
    )
}