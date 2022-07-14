import { SelectChangeEvent, Typography, FormControl, Select, MenuItem, Card, Grid, useTheme, Box, styled } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { setCurrentSprint } from "./sprintSlice";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

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
            <Grid container direction="row" alignItems="center" padding='10px' columns={20}>
                <Grid item xs={7}>
                    <Typography variant="h1" color='background.paper' sx={{paddingLeft: '10px'}}>
                        Current Sprint
                    </Typography>
                </Grid>
                <Grid item xs={2}>
                    
                </Grid>
                <Grid item xs={5}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="caption" color='background.default' sx={{paddingBottom: '5px'}}>
                            Progress&nbsp;<Box component='span' sx={{color: 'error.light'}}>&#40;{calculateNewTaskNumber()}&#41;</Box>&nbsp;<Box component='span' sx={{color: 'warning.light'}}>&#40;{calculateTodayTaskNumber()}&#41;</Box>&nbsp;<Box component='span' sx={{color: 'success.light'}}>&#40;{calculateCompletedTaskNumber()}&#41;</Box>
                        </Typography>
                        <BorderLinearProgress variant="determinate" value={calculateProgress()} />
                    </Box>
                </Grid>
                <Grid item xs={6}>
                    <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'right', mr: '20px'}}>
                        <FormControl sx={{m: '5px', minWidth: "120px"}}>
                            <Select
                                value={currentSprint || ""}
                                onChange={handleSprintChange}
                                sx={{ backgroundColor: 'white'}}
                                >
                                {sprints?.map((sprint, index) => (
                                    <MenuItem key={index} value={sprint.sprintEntityId}>{sprint.sprintEntityId}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Typography>
                </Grid>
            </Grid>
        </Card>
    )
}