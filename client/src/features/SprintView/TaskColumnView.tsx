import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, Paper, Stack, Typography, Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import React from "react";
import { Task } from "../../app/models/task";
import StateToggleButton from "./StateToggleButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface Props {
    tasks: Task[]
}

export default function TaskColumnView({tasks}: Props) {

    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
      (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
      };


    return (
        <Box padding={'5px'}>
            { /* Might want to abstract the card in the future */ }
            {tasks.map((task, index) => (
         
                <Accordion expanded={expanded === 'panel' + index}  onChange={handleChange('panel' + index)}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Card sx={{margin: "10px", width: "100%" }} elevation={2} key={index}>
                        <CardHeader title = {task.name} />
                        <Typography sx={{ fontSize: 14, marginLeft: '10px'  }} color="text.secondary" gutterBottom>
                            {task.description}
                        </Typography>
                        
                    </Card>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Grid container sx={{display: 'flex', width: 'auto'}}>
                        <Grid item xs={6}>
                            <Box sx={{flexGrow: 1, textAlign: 'left'}}>
                                <StateToggleButton startingState={task.currentState}/>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{flexGrow: 1, textAlign: 'right', marginRight: '5px'}}>
                                <Button variant='contained'>Open task</Button>
                            </Box>
                        </Grid>
                    </Grid>
                    </AccordionDetails>
                </Accordion>
                

            ))}   
        </Box>
    )
}