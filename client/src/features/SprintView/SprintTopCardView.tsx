import { SelectChangeEvent, Typography, FormControl, Select, MenuItem, Card, Grid, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { setCurrentSprint } from "./sprintSlice";

export default function SprintTopCardView() {

    const dispatch = useAppDispatch();
    const { currentSprint } = useAppSelector(state => state.sprintView);
    const sprints = useAppSelector(state => state.user.userData?.sprints);
    const theme = useTheme();

    const handleSprintChange = (event: SelectChangeEvent) => {
        dispatch(setCurrentSprint(event.target.value));
    }

    return (
        <Card sx={{background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`}}>
            <Grid container direction="row" alignItems="center" padding='10px'>
                <Grid item xs={8}>
                    <Typography variant="h1" color='background.default' sx={{paddingLeft: '10px'}}>
                        Current Sprint
                    </Typography>
                </Grid>
                <Grid item xs={4}>
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