import { Box, Button, Card, CardHeader, Grid, Typography, Accordion, AccordionDetails, AccordionSummary, Divider, Backdrop, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import { Task } from "../../app/models/task";
import StateToggleButton from "./StateToggleButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SubTasksView from "./SubTasksView";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

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
                        {task.subTasks.length > 0 && <SubTasksView task={task} />}
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
            {open &&
                <Backdrop
                sx={{ color: '#FAFAFA', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
              >
                <Dialog open={open} onClose={handleClose} maxWidth='xs'>
                    <DialogTitle>{focusedTask?.name}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {focusedTask?.description}
                        </DialogContentText>
                        <Divider sx={{paddingTop: '5px', paddingBottom: '5px'}}/>
                        <Grid container paddingTop='10px' display='flex'>
                            <Grid item xs={6}>
                                {/* ABSTRACT THIS OUT IN THE FUTURE*/}
                                {focusedTask?.currentState == 0 ? 
                                    <>
                                        <Grid container>
                                            <Grid item paddingRight='5px'>
                                                <HighlightOffIcon color="error"/>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1">New</Typography>
                                            </Grid>
                                        </Grid>
                                    </>
                               : focusedTask?.currentState == 1 ? 
                                    <>
                                        <Grid container>
                                            <Grid item paddingRight='5px'>
                                                <PunchClockIcon color="warning"/>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1">Active</Typography>
                                            </Grid>
                                        </Grid>
                                        
                                    </> 
                               : 
                                    <>
                                        <Grid container>
                                            <Grid item paddingRight='5px'>
                                                <CheckCircleOutlineIcon color="success"/>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="body1">Completed</Typography>
                                            </Grid>
                                        </Grid>
                                    </> }
                            </Grid>
                            <Grid item xs={6}>
                                {focusedTask?.dueDate &&
                                    <Typography variant="body1" sx={{flexGrow: 1, textAlign: 'right', verticalAlign: "middle", mr: '20px'}}>
                                        Due date:&nbsp;
                                        { 
                                        new Date(focusedTask?.dueDate).toLocaleDateString()
                                        }
                                    </Typography>                                
                                }
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Edit</Button>
                        <Button onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
                
              </Backdrop>
            }   
        </Box>
    )
}