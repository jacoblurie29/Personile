import { Box, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { setCurrentSprint, setLoading } from "./sprintSlice";
import TaskColumnView from "./TaskColumnView";


// "{tasks}: Props" destructures the props for the fields inside
export default function SprintView() {

        const sprints = useAppSelector(state => state.user.userData?.sprints);
        const { currentSprint, loading } = useAppSelector(state => state.sprintView);
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
            {!loading &&
            <Grid container 
                spacing={1}
                columns={12.5}
                display='flex'
                justifyContent='center'

                >
                <Grid item xs={4} justifyContent="center" sx={{borderRadius:'5px'}} marginRight='20px'>
                    <TaskColumnView sprintId={currentSprint || ""} stateTitle={"New"} tasks={sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
                        return task.currentState === 0;
                    }) || []} />
                </Grid>  
                <Grid item xs={4} justifyContent="center" sx={{ borderRadius:'5px'}} marginRight='20px'>
                    <TaskColumnView sprintId={currentSprint || ""} stateTitle={"Active"} tasks={sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
                        return task.currentState === 1;
                    }) || []} />
                </Grid>
                <Grid item xs={4} justifyContent="center" sx={{ borderRadius:'5px'}}>
                    <TaskColumnView sprintId={currentSprint || ""} stateTitle={"Completed"} tasks={sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
                        return task.currentState === 2;
                    }) || []} />
                </Grid>
            </Grid>
            }
            {loading &&
                <LoadingComponent />
            }
        </Box>
        
        
    )
}