import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setCurrentSprint, setLoading } from "./sprintSlice";
import TaskColumnView from "./TaskColumnView";


// "{tasks}: Props" destructures the props for the fields inside
export default function SprintView() {

        const sprints = useAppSelector(state => state.user.userData?.sprints);
        const { currentSprint, loading, isExpanded } = useAppSelector(state => state.sprintView);
        const dispatch = useAppDispatch();
;

        const handleSprintChange = (event: SelectChangeEvent) => {
            dispatch(setLoading(true));
            dispatch(setCurrentSprint(event.target.value));
            dispatch(setLoading(false));
        }

        // sets the initial sprint upon load (will use date time later)
        useEffect(() => {
            if(sprints != undefined)
                dispatch(setCurrentSprint(sprints[0].sprintEntityId));
        }, [])
      
      

    if(loading) return (

        <Box marginTop='20px'>
            <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'right', verticalAlign: "middle", mr: '20px'}}>
                <FormControl sx={{m: 1, minWidth: "120px"}}>
                    <Select
                        value={currentSprint || ""}
                        onChange={handleSprintChange}
                        displayEmpty
                        sx={{ backgroundColor: 'white'}}
                    >
                        {sprints?.map((sprint, index) => (
                            <MenuItem key={index} value={sprint.sprintEntityId}>{sprint.sprintEntityId}</MenuItem>
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
                        value={currentSprint || ""}
                        onChange={handleSprintChange}
                        displayEmpty
                        sx={{ backgroundColor: 'white'}}
                    >
                        {sprints?.map((sprint, index) => (
                            <MenuItem key={index} value={sprint.sprintEntityId}>{sprint.sprintEntityId}</MenuItem>
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
                    <TaskColumnView stateTitle={"New"} tasks={sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
                        return task.currentState === 0;
                    }) || []} />
                </Grid>  
                <Grid item xs={4} justifyContent="center" sx={{ borderRadius:'5px'}} marginRight='20px'>
                    <TaskColumnView stateTitle={"Active"} tasks={sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
                        return task.currentState === 1;
                    }) || []} />
                </Grid>
                <Grid item xs={4} justifyContent="center" sx={{ borderRadius:'5px'}}>
                    <TaskColumnView stateTitle={"Completed"} tasks={sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
                        return task.currentState === 2;
                    }) || []} />
                </Grid>
            </Grid>
        </Box>
        
        
    )
}