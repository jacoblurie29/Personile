import { Box, Button, Card, CardHeader, Grid, Typography, Accordion, AccordionDetails, AccordionSummary, Divider, Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import { Task } from "../../app/models/task";
import StateToggleButton from "./StateToggleButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SubTasksView from "./SubTasksView";
import TaskDialog from "./TaskDialog";


interface Props {
    tasks: Task[],
    stateTitle: String
}

export default function TaskColumnView({tasks, stateTitle}: Props) {

    const [expanded, setExpanded] = useState<string | false>(false);
    const [open, setOpen] = useState(false);
    const [focusedTask, setFocusedTask] = useState<Task>();

    const handleChange =
      (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
      };

    function chooseColor(title: String) {
        return title === "New" ? '#FFCCCB' : stateTitle === "Active" ? '#FFDE99' : '#ABF7B1'
    }

    const handleClose = () => {
        setOpen(false);
    };


    const handleToggle = (task: Task) => {
        setFocusedTask(task);
        setOpen(false);
        setOpen(true);
    };


    return (
        <Box sx={{height: '100%', pr: '10px'}} margin='5px'>
            { /* Might want to abstract the card in the future */ }
            <Typography variant='h4'>{stateTitle}</Typography>
            {tasks.map((task, index) => (
         
                <Accordion sx={{backgroundColor: chooseColor(stateTitle)}} expanded={expanded === 'panel' + index}  onChange={handleChange('panel' + index)} key={index}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Card sx={{margin: "10px", width: "100%" }} elevation={2} key={index}>
                        <CardHeader title = {task.name} />
                        <Typography sx={{ fontSize: 14, marginLeft: '10px'  }} color="text.secondary" gutterBottom>
                            {task.description}
                        </Typography>
                        
                    </Card>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails sx={{alignItems: 'center'}}>
                    <Card elevation={1} sx={{width: '100%', mb: '10px', backgroundColor: 'rgba(256, 256, 256, 0.5)'}}>
                        {task.subTasks.length > 0 && <SubTasksView task={task} isDialog={false}/>}
                    </Card>
                    <Grid container sx={{display: 'flex', width: 'auto'}}>
                        <Grid item xs={6}>
                            <Box sx={{flexGrow: 1, textAlign: 'left'}}>
                                <StateToggleButton startingState={task.currentState}/>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{flexGrow: 1, textAlign: 'right', marginRight: '5px', marginTop: '5px'}}>
                                <Button variant='contained' onClick={() => handleToggle(task)}>Open task</Button>
                            </Box>
                        </Grid>
                    </Grid>
                    </AccordionDetails>
                </Accordion>
                
            ))}
            {focusedTask != null &&
                <TaskDialog focusedTask={focusedTask} open={open} handleClose={handleClose} />
            }   
        </Box>
    )
}