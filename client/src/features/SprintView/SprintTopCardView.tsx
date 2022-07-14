import { SelectChangeEvent, Typography, FormControl, Select, MenuItem, Card, Grid, useTheme, Box, styled, IconButton } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { setCurrentSprint } from "./sprintSlice";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { formatDateString, formatDateStringNoYear } from "app/util/dateUtil";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function SprintTopCardView() {

    const dispatch = useAppDispatch();
    const { currentSprint } = useAppSelector(state => state.sprintView);
    const sprints = useAppSelector(state => state.user.userData?.sprints);
    const theme = useTheme();

    const handleSprintChange = (event: SelectChangeEvent) => {
        dispatch(setCurrentSprint(event.target.value));
    }

    const calculateProgress = () => {
        var totalTasks = sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.length || 1;
        var completedTasks = sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
            return task.currentState === 2;
        }).length || 1;

        return (completedTasks / totalTasks) * 100;
    }

    const calculateNewTaskNumber = () => {
        return sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
            return task.currentState === 0;
        }).length || 0;
    }

    const calculateTodayTaskNumber = () => {
        return sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
            return task.currentState === 1;
        }).length || 0;
    }

    const calculateCompletedTaskNumber = () => {
        return sprints?.find(s => s.sprintEntityId == currentSprint)?.tasks.filter((task) => {
            return task.currentState === 2;
        }).length || 0;
    }

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        paddingBottom: '10px',
        [`&.${linearProgressClasses.colorPrimary}`]: {
          backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
          borderRadius: 5,
          backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
        },
    }));

    return (
        <Card sx={{background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`}}>
            <Grid container alignItems = "center">
                <Grid item xs={8}>
                    <Grid container direction="row" alignItems="center" padding='10px' paddingBottom={0} paddingRight='10px' columns={10}>
                        <Grid item xs={4}>
                            <Typography variant="h1" color='background.paper' sx={{paddingLeft: '10px'}}>
                                Current Sprint
                            </Typography>
                        </Grid>
                    <Grid item xs={1}>
                        
                    </Grid>
                    <Grid item xs={4}>
                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="caption" color='background.default' sx={{paddingBottom: '5px'}}>
                                Progress&nbsp;<Box component='span' sx={{color: 'error.light'}}>&#40;{calculateNewTaskNumber()}&#41;</Box>&nbsp;<Box component='span' sx={{color: 'warning.light'}}>&#40;{calculateTodayTaskNumber()}&#41;</Box>&nbsp;<Box component='span' sx={{color: 'success.light'}}>&#40;{calculateCompletedTaskNumber()}&#41;</Box>
                            </Typography>
                            <BorderLinearProgress variant="determinate" value={calculateProgress()} />
                        </Box>
                    </Grid>
                    <Grid item xs={1}>
                        
                    </Grid>
                </Grid>
                    <Typography variant="caption" color='background.default' sx={{paddingBottom: '5px'}}>
                        <>
                        Start Date: {formatDateString(sprints?.find(s => s.sprintEntityId == currentSprint)?.startDate || "")}
                        </>
                    </Typography>
                    <br />
                    <Typography variant="caption" color='background.default' sx={{paddingBottom: '5px'}}>
                        End Date: {formatDateString(sprints?.find(s => s.sprintEntityId == currentSprint)?.endDate || "")}
                    </Typography>
                </Grid>
                <Grid item xs={4} flexGrow={1} >
                        <Box sx={{padding: '5px', borderRadius: '8px',textAlign: 'right', mr: '20px', backgroundColor: 'primary.light', width: '200px'}} flexGrow={1} justifyContent='flex-end'>
                            <Grid container flexGrow={1} alignItems='center' textAlign='center' columns={14} justifyContent='flex-end'>
                                <Grid item xs={3} style={{textAlign: "left"}}>
                                    <IconButton>
                                        <ChevronLeftIcon />
                                    </IconButton>
                                </Grid>
                                <Grid item xs={8} style={{textAlign: "center"}}>
                                    <Typography variant="h6" sx={{color: 'background.paper', textAlign:'center'}}>
                                        {formatDateStringNoYear(sprints?.find(s => s.sprintEntityId == currentSprint)?.startDate || "") + " - " + formatDateStringNoYear(sprints?.find(s => s.sprintEntityId == currentSprint)?.endDate || "")}
                                    </Typography>
                                    
                                </Grid>
                                <Grid item xs={3} style={{textAlign: "right"}}>
                                    <IconButton>
                                        <ChevronRightIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                </Grid>
            </Grid>
        </Card>
    )
}