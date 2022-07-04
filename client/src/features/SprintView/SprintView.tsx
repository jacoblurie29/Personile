import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { useAppContext } from "../../app/context/AppContext";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Task } from "../../app/models/task";
import TaskColumnView from "./TaskColumnView";


// "{tasks}: Props" destructures the props for the fields inside
export default function SprintView() {

        const {sprints, titles} = useAppContext();

        const [loading, setLoading] = useState(true);
        const [currentSprintTitle, setCurrentSprintTitle] = useState<string>("");
        const [tasks, setTasks] = useState<Task[]>();

        const handleSprintChange = (event: SelectChangeEvent) => {
            setLoading(true);
            setCurrentSprintTitle(event.target.value);
            setLoading(false);
        }
      
        // useEffect loads the titles for the selector and the initial tasks for the screen
        useEffect(() => {
           var title = "";
           if(titles != null) {
                title = titles[0];
                setCurrentSprintTitle(titles[0]);
           }

           if(sprints != null) {
                var deepSprintCopy = Object.values(sprints);
                var cs = deepSprintCopy.find(x => x.sprintEntityId === title);
                setTasks(cs?.tasks);
           }
           setLoading(false);
           
        }, [sprints, titles])

        // use effect checks for the changing of the currentSprintTitle state (the selector) and updates the screen as such
        useEffect(() => {
            setLoading(true);
            if(sprints != null) {
                var deepSprintCopy = Object.values(sprints);
                var cs = deepSprintCopy.find(x => x.sprintEntityId === currentSprintTitle);
                setTasks(cs?.tasks);
            }
            setLoading(false);
        }, [currentSprintTitle, sprints])
      

    if(loading) return (

        <Box marginTop='20px'>
            <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'right', verticalAlign: "middle", mr: '20px'}}>
                <FormControl sx={{m: 1, minWidth: "120px"}}>
                    <Select
                        value={currentSprintTitle}
                        onChange={handleSprintChange}
                        displayEmpty
                        sx={{ backgroundColor: 'white'}}
                    >
                        {titles?.map((title, index) => (
                            <MenuItem key={index} value={title}>{title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Typography>
            <LoadingComponent />
        </Box>

    )
    
    return (
        <Box marginTop='20px'>
            <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'right', verticalAlign: "middle", mr: '20px'}}>
                <FormControl sx={{m: '5px', minWidth: "120px"}}>
                    <Select
                        value={currentSprintTitle}
                        onChange={handleSprintChange}
                        displayEmpty
                        sx={{ backgroundColor: 'white'}}
                    >
                        {titles?.map((title, index) => (
                            <MenuItem key={index} value={title}>{title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Typography>
            <Grid container 
                spacing={1}
                columns={12.5}
                display='flex'
                justifyContent='center'

                >
                <Grid item xs={4} justifyContent="center" sx={{borderRadius:'5px'}} marginRight='20px'>
                    <TaskColumnView stateTitle={"New"} tasks={tasks?.filter((task) => {
                        return task.currentState === 0;
                    }) || []} />
                </Grid>  
                <Grid item xs={4} justifyContent="center" sx={{ borderRadius:'5px'}} marginRight='20px'>
                    <TaskColumnView stateTitle={"Active"} tasks={tasks?.filter((task) => {
                        return task.currentState === 1;
                    }) || []} />
                </Grid>
                <Grid item xs={4} justifyContent="center" sx={{ borderRadius:'5px'}}>
                    <TaskColumnView stateTitle={"Completed"} tasks={tasks?.filter((task) => {
                        return task.currentState === 2;
                    }) || []} />
                </Grid>
            </Grid>
        </Box>
        
        
    )
}