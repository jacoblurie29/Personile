import { Typography, Card, Grid, useTheme, Box, IconButton, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { setCurrentSprint } from "./sprintSlice";
import { formatDateString, formatDateStringNoYear } from "app/util/dateUtil";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function SprintTopCardView() {

    const dispatch = useAppDispatch();
    const { currentSprint, currentBoard } = useAppSelector(state => state.sprintView);
    const sprints = useAppSelector(state => state.user.userData?.boards.find(b => b.boardEntityId === currentBoard)?.sprints);
    const theme = useTheme();



    const handleSprintChangeBackwards = () => {
        
        var currentSprintStartTime = Date.parse(sprints?.find(s => s.sprintEntityId === currentSprint)?.startDate || "");
        var newSprint = sprints?.find(s => Date.parse(s.endDate) > currentSprintStartTime - 95040000 && Date.parse(s.endDate) < currentSprintStartTime);

        console.log(newSprint?.sprintEntityId)
        console.log(sprints !== undefined && Date.parse(sprints[1].endDate))

        if (newSprint !== undefined) {
            dispatch(setCurrentSprint(newSprint.sprintEntityId));
        }

    }

    const handleSprintChangeForwards = () => {

        var currentSprintEndTime = Date.parse(sprints?.find(s => s.sprintEntityId === currentSprint)?.endDate || "");
        var newSprint = sprints?.find(s => Date.parse(s.startDate) < currentSprintEndTime + 95040000 && Date.parse(s.startDate) > currentSprintEndTime);
        
        console.log(newSprint)

        /*
            This will be where we generate new sprints for the group. The default group will have 5 sprints. If you get to a sprint that doesn't have a 
            future sprint that is 5 sprints away, we generate that in the background
        */

        if (newSprint !== undefined) {
            dispatch(setCurrentSprint(newSprint.sprintEntityId));
        }
    }

    const calculateNewTaskBorder = () => {
        if (calculateTodayTaskNumber() === 0 && calculateCompletedTaskNumber() === 0) {
            return '5px'
        } else {
            return '5px 0 0 5px';
        }
    }

    const calculateTodayTaskBorder = () => {
        if (calculateNewTaskNumber() === 0 && calculateCompletedTaskNumber() === 0) {
            return '5px'
        } else if (calculateNewTaskNumber() === 0) {
            return '5px 0 0 5px';
        } else if (calculateCompletedTaskNumber() === 0) {
            return '0 5px 5px 0';
        } else {
            return '0px';
        }
    }

    const calculateCompletedTaskBorder = () => {
        if (calculateTodayTaskNumber() === 0 && calculateCompletedTaskNumber() === 0) {
            return '5px'
        } else {
            return '0 5px 5px 0';
        }
    }

    const calculateNewTaskNumber = () => {
        return sprints?.find(s => s.sprintEntityId === currentSprint)?.tasks.filter((task) => {
            return task.currentState === 0;
        }).length || 0;
    }

    const calculateTodayTaskNumber = () => {
        return sprints?.find(s => s.sprintEntityId === currentSprint)?.tasks.filter((task) => {
            return task.currentState === 1;
        }).length || 0;
    }

    const calculateCompletedTaskNumber = () => {
        return sprints?.find(s => s.sprintEntityId === currentSprint)?.tasks.filter((task) => {
            return task.currentState === 2;
        }).length || 0;
    }

    return (
        <Card sx={{background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`}}>
            <Grid container alignItems = "center" columns={20}>
                <Grid item xl={17} lg={17} md={16} sm={20} xs={20}>
                    <Grid container direction="row" alignItems="center" padding='10px' paddingBottom={0} paddingRight='10px' columns={12}>
                        <Grid item xl={3} lg={3} md={4} sm={12} xs={12}>
                            <Stack paddingBottom='5px'>
                                <Typography variant="h1" color='background.paper' sx={{paddingLeft: '10px'}}>
                                    Current Sprint
                                </Typography>
                                <Typography variant="caption" color='background.default' sx={{paddingLeft: '10px'}}>
                                    <>
                                    Start Date: {formatDateString(sprints?.find(s => s.sprintEntityId === currentSprint)?.startDate || "")}
                                    </>
                                </Typography>
                                <Typography variant="caption" color='background.default' sx={{paddingBottom: '5px', paddingLeft: '10px'}}>
                                    End Date: {formatDateString(sprints?.find(s => s.sprintEntityId === currentSprint)?.endDate || "")}
                                </Typography>
                            </Stack>
                        </Grid>
                        <Grid item xl={9} lg={9} md={8} sm={12} xs={12} alignContent='center' justifyContent='center'>
                            <Box sx={{marginBottom: '3px', width: '90%', marginRight: 'auto', marginLeft:'auto'}} >
                                <Typography variant="h6" sx={{color: 'background.paper'}}>
                                    Progress:
                                </Typography>
                            </Box>
                            <Box sx={{marginBottom: '10px', width: '90%', marginRight: 'auto', marginLeft:'auto'}} >
                                {(calculateNewTaskNumber() + calculateTodayTaskNumber() + calculateCompletedTaskNumber()) === 0 ?
                                    <Grid container columns={12}>
                                        <Grid item xs={12}>
                                            <Box textAlign='center' sx={{borderRadius: '5px', backgroundColor: 'grey.400', color: 'background.paper', padding: '4px'}}>No tasks</Box>
                                        </Grid>
                                    </Grid>
                                :
                                <Grid container columns={calculateNewTaskNumber() + calculateTodayTaskNumber() + calculateCompletedTaskNumber()}>
                                    {calculateNewTaskNumber() !== 0 && 
                                        <Grid item xs={calculateNewTaskNumber()}>
                                            <Box textAlign='center' sx={{borderRadius: calculateNewTaskBorder(), backgroundColor: 'error.light', color: 'background.paper', padding: '4px'}}>New&nbsp;&#40;{calculateNewTaskNumber()}&#41;</Box>
                                        </Grid>
                                    }
                                    {calculateTodayTaskNumber() !== 0 && 
                                        <Grid item xs={calculateTodayTaskNumber()}>
                                            <Box textAlign='center' sx={{borderRadius: calculateTodayTaskBorder(), backgroundColor: 'warning.light', color: 'background.paper', padding: '4px'}}>Today&nbsp;&#40;{calculateTodayTaskNumber()}&#41;</Box>
                                        </Grid>
                                    }
                                    {calculateCompletedTaskNumber() !== 0 && 
                                        <Grid item xs={calculateCompletedTaskNumber()}>
                                            <Box textAlign='center' sx={{borderRadius: calculateCompletedTaskBorder(), backgroundColor: 'success.light', color: 'background.paper', padding: '4px'}}>Completed&nbsp;&#40;{calculateCompletedTaskNumber()}&#41;</Box>
                                        </Grid>
                                    }
                                </Grid>
                                }
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xl={3} lg={3} md={4} sm={20} xs={20} paddingRight='20px'>  
                    <Stack direction='row' alignContent='center'>
                        <IconButton onClick={() => handleSprintChangeBackwards()}>
                            <ChevronLeftIcon />
                        </IconButton>
                        <Typography variant="h6" sx={{color: 'background.paper', textAlign:'center'}} margin='auto'>
                            {formatDateStringNoYear(sprints?.find(s => s.sprintEntityId === currentSprint)?.startDate || "") + " - " + formatDateStringNoYear(sprints?.find(s => s.sprintEntityId === currentSprint)?.endDate || "")}
                        </Typography>
                        <IconButton onClick={() => handleSprintChangeForwards()}>
                            <ChevronRightIcon />
                        </IconButton> 
                    </Stack>    
                </Grid>
            </Grid>
        </Card>
    )
}