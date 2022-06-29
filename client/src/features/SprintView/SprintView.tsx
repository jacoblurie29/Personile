import { Box, Grid } from "@mui/material";
import { Task } from "../../app/models/task";
import TaskColumnView from "./TaskColumnView";

interface Props {
    tasks: Task[]
}

// "{tasks}: Props" destructures the props for the fields inside
export default function SprintView({tasks: taskList}: Props) {

    return (
        <Box sx={{ flexGrow: 1, height: '100%'}}>
            <Grid container 
                spacing={1}
                columns={12.2}
                sx={{height: '100%'}}
                display='flex'
                justifyContent='center'

                >
                <Grid item xs={4} justifyContent="center">
                    <TaskColumnView stateTitle={"New"} tasks={taskList.filter((task) => {
                        return task.currentState === 0;
                    })} />
                </Grid>  
                <Grid item xs={4}>
                    <TaskColumnView stateTitle={"Active"} tasks={taskList.filter((task) => {
                        return task.currentState === 1;
                    })} />
                </Grid>
                <Grid item xs={4}>
                    <TaskColumnView stateTitle={"Completed"} tasks={taskList.filter((task) => {
                        return task.currentState === 2;
                    })} />
                </Grid>
            </Grid>
        </Box>
        
        
    )
}