import { Accordion, AccordionSummary, Box, CardHeader, Typography, Divider, AccordionDetails, Grid, Button } from "@mui/material";
import StateToggleButton from "./StateToggleButton";
import TaskMoreDetails from "./TaskMoreDetails";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Task } from "../../app/models/task";
import { useAppSelector, useAppDispatch } from "../../app/store/configureStore";
import { removeFromIsExpanded, addToIsExpanded } from "./sprintSlice";

interface Props {
    task: Task
}

export default function TaskCardView({task}: Props) {

    const {currentSprint, isExpanded: expanded } = useAppSelector(state => state.sprintView);
    const dispatch = useAppDispatch();


    function chooseColor(title: number) {
        return title === 0 
            ? 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)' 
            : title === 1 ? 'linear-gradient(90deg, rgba(255,209,125,1) 0%, rgba(255,196,54,1) 100%)' 
            : 'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)'
    }

    const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
       if(expanded?.includes(panel)) {
          dispatch(removeFromIsExpanded(panel));
       } else {
          dispatch(addToIsExpanded(panel));
       }
    };


    

    return (
        <Accordion sx={{background: chooseColor(task.currentState), marginBottom: '10px', borderRadius: '5px'}} expanded={expanded?.includes(task.id + "|" + task.name + "|" + currentSprint)}  onChange={handleChange(task.id + "|" + task.name + "|" + currentSprint)} key={task.id}>
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
    )
}