import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, Paper, Stack, Typography } from "@mui/material";
import { Task } from "../../app/models/task";
import StateToggleButton from "./StateToggleButton";

interface Props {
    tasks: Task[]
}

export default function TaskColumnView({tasks}: Props) {

    return (
        <Box>
            { /* Might want to abstract the card in the future */ }
            {tasks.map(task => (
                
                <Card sx={{ minWidth: 200, margin: "10px auto", width: 400 }} elevation={2}>
                    <CardHeader title = {task.name} />
                    <CardContent>
                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                        {task.description}
                    </Typography>
                    </CardContent>
                    <CardActions sx={{display: 'flex', width: 'auto'}}>
                        <Box sx={{flexGrow: 1, textAlign: 'left'}}>
                            <StateToggleButton startingState={task.currentState}/>
                        </Box>
                        <Box sx={{flexGrow: 1, textAlign: 'right', marginRight: '5px'}}>
                            <Button variant='contained'>Open task</Button>
                        </Box>
                    </CardActions>
                </Card>

            ))}   
        </Box>
    )
}