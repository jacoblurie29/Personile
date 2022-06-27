import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, Paper, Stack, Typography } from "@mui/material";
import { Task } from "../../app/models/task";
import StateToggleButton from "./StateToggleButton";

interface Props {
    tasks: Task[]
}

export default function TaskColumnView({tasks}: Props) {

    return (
        <Box>
            {tasks.map(task => (
                
                <Card sx={{ minWidth: 200, margin: "10px auto", width: 400 }} elevation={2}>
                    <CardHeader title = {task.name} />
                    <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {task.description}
                    </Typography>
                    </CardContent>
                    <CardActions>
                        <StateToggleButton startingState={task.currentState}/>
                    </CardActions>
                </Card>

            ))}   
        </Box>
    )
}