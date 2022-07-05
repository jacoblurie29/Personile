import { Box, Button, CardHeader, Grid, Typography, Accordion, AccordionDetails, AccordionSummary, Divider } from "@mui/material";
import React, { useState } from "react";
import { Task } from "../../app/models/task";
import StateToggleButton from "./StateToggleButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TaskMoreDetails from "./TaskMoreDetails";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { addToIsExpanded, removeFromIsExpanded } from "./sprintSlice";
import NewTaskButton from "./NewTaskButton";


interface Props {
    tasks: Task[],
    stateTitle: String
}

export default function TaskColumnView({tasks, stateTitle}: Props) {

    const {currentSprint, isExpanded: expanded } = useAppSelector(state => state.sprintView);
    const dispatch = useAppDispatch();

    function handleNewTask() {
        return null;
    }

    const handleChange =
      (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
         if(expanded?.includes(panel)) {
            dispatch(removeFromIsExpanded(panel));
         } else {
            dispatch(addToIsExpanded(panel));
         }
      };

    function chooseColor(title: String) {
        return title === "New" 
            ? 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)' 
            : stateTitle === "Active" ? 'linear-gradient(90deg, rgba(255,209,125,1) 0%, rgba(255,196,54,1) 100%)' 
            : 'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)'
    }



    return (
        <Box sx={{height: '100%', pr: '10px'}} margin='5px'>
            { /* Might want to abstract the card in the future */ }
            <Typography variant='h4' sx={{fontWeight: '700', color: 'white'}}>{stateTitle}</Typography>
            {tasks.map((task, index) => (
                <Accordion sx={{background: chooseColor(stateTitle), marginBottom: '10px', borderRadius: '5px'}} expanded={expanded?.includes((currentSprint || "") + "|" + index + "|" + stateTitle)}  onChange={handleChange((currentSprint || "") + "|" + index + "|" + stateTitle)} key={index}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box flexGrow={1}>
                            <CardHeader title = {task.name} sx={{color: 'white'}} titleTypographyProps={{variant: 'h5', fontFamily:'Open Sans', fontWeight:'700'}}/>
                            <Typography sx={{ fontSize: 14, marginLeft: '4%', width:'90%' }} color="text.secondary">
                                {task.description}
                            </Typography> 
                        </Box>
                    </AccordionSummary>
                    <Divider />
                    <AccordionDetails sx={{alignItems: 'center'}}>
                    <TaskMoreDetails focusedTask={task} />
                    <Grid container sx={{display: 'flex', width: 'auto'}}>
                        <Grid item xs={6}>
                            <Box sx={{flexGrow: 1, textAlign: 'left'}}>
                                <StateToggleButton startingState={task.currentState}/>
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box sx={{flexGrow: 1, textAlign: 'right', marginRight: '5px', marginTop: '5px'}}>
                                <Button variant='contained'>Edit task</Button>
                            </Box>
                        </Grid>
                    </Grid>
                    </AccordionDetails>
                </Accordion>
                
            ))}
            {stateTitle == "New" && <NewTaskButton addNewTaskOnClick={handleNewTask}/>}
        </Box>
    )
}