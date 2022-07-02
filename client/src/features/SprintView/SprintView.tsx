import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import agent from "../../app/api/agent";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { Task } from "../../app/models/task";
import TaskColumnView from "./TaskColumnView";


// "{tasks}: Props" destructures the props for the fields inside
export default function SprintView() {


        const [loading, setLoading] = useState(true);
        const [tasks, setTasks] = useState<Task[]>();
        const [sprints, setSprints] = useState<string[]>([]);
        const [sprint, setSprint] = useState<string>("");

        const handleSprintChange = (event: SelectChangeEvent) => {
            setTasks(undefined);
            setLoading(true);
            setSprint(event.target.value);
            var currentSprint = event.target.value;
            agent.Sprint.getSprint(currentSprint).then(response => setTasks(response.tasks));
            setLoading(false);
        }
      
        useEffect(() => {
            setLoading(true);
            agent.Sprint.titles()
            .then(response => {
                  setSprints(response);
                  // setSprints state function is asyncronous so a local variable must be introduced
                  var currentSprint = ""
                    if (response) {

                        // HERE is where the current sprint will have to be figured out
                        setSprint(response[0]);
                        currentSprint = response[0];
                    }
                    agent.Sprint.getSprint(currentSprint).then(response => setTasks(response.tasks));
                  
              })
            .finally(() => {
                setLoading(false);
            }).catch(error => console.log(error))
        
            
        }, [])
      

    if(loading || tasks == undefined) return (

        <Box sx={{ flexGrow: 1, height: '100%'}}>
            <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'right', verticalAlign: "middle", mr: '20px'}}>
                <FormControl sx={{m: 1, minWidth: "120px"}}>
                    <Select
                        value={sprint}
                        onChange={handleSprintChange}
                        displayEmpty
                        sx={{ backgroundColor: 'white'}}
                    >
                        {sprints?.map((title, index) => (
                            <MenuItem key={index} value={title}>{title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Typography>
            <LoadingComponent />
        </Box>

    )
    
    
    
    
    

    return (
        <Box sx={{ flexGrow: 1, height: '100%'}}>
            <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'right', verticalAlign: "middle", mr: '20px', marginBottom: '20px'}}>
                <FormControl sx={{m: '5px', minWidth: "120px"}}>
                    <Select
                        value={sprint}
                        onChange={handleSprintChange}
                        displayEmpty
                        sx={{ backgroundColor: 'white'}}
                    >
                        {sprints?.map((title, index) => (
                            <MenuItem key={index} value={title}>{title}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Typography>
            <Grid container 
                spacing={1}
                columns={12.5}
                sx={{height: '100%', width: '100%'}}
                display='flex'
                justifyContent='center'

                >
                <Grid item xs={4} justifyContent="center" sx={{backgroundColor:'#EEEEEE', borderRadius:'5px'}} marginRight='20px' marginBottom='10px'>
                    <TaskColumnView stateTitle={"New"} tasks={tasks?.filter((task) => {
                        return task.currentState === 0;
                    }) || []} />
                </Grid>  
                <Grid item xs={4} justifyContent="center" sx={{backgroundColor:'#EEEEEE', borderRadius:'5px'}} marginRight='20px' marginBottom='10px'>
                    <TaskColumnView stateTitle={"Active"} tasks={tasks?.filter((task) => {
                        return task.currentState === 1;
                    }) || []} />
                </Grid>
                <Grid item xs={4} justifyContent="center" sx={{backgroundColor:'#EEEEEE', borderRadius:'5px'}} marginBottom='10px'>
                    <TaskColumnView stateTitle={"Completed"} tasks={tasks?.filter((task) => {
                        return task.currentState === 2;
                    }) || []} />
                </Grid>
            </Grid>
        </Box>
        
        
    )
}