import { Box, Button, Typography } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import EastIcon from '@mui/icons-material/East';

export default function HomeView() {

    const user = useAppSelector(state => state.user.userData);
    
    const allTasks = user?.boards.flatMap(b => b.sprints.flatMap(s => s.tasks));
    const remainingTasks = allTasks?.filter(t => t.currentState !== 2).length;
    const totalTasks = user?.boards.length;
    const tasksCompletedYesterday = allTasks?.filter(t => {
        return Date.now() - Date.parse(t.dateFinished) < (86400000 + new Date().getTime()) && (Date.now() - Date.parse(t.dateFinished) > new Date().getTime());
    }).length;
    const tasksCompletedThisWeek = allTasks?.filter(t => {
        return Date.now() - Date.parse(t.dateFinished) < 86400000 * 7;
    }).length;

    return (
        <Box sx={{textAlign: 'center', marginTop: '200px'}}>
            <Typography sx={{color: 'primary.main'}} variant="h1">{"Welcome back, "}<Box component={"span"} sx={{color: 'secondary.light'}}>{user?.firstName}</Box>{"."}</Typography>
            <br />
            <Typography sx={{color: 'primary.main'}} variant="h1">{"You have "}<Box component={"span"} sx={{color: 'secondary.light'}}>{remainingTasks}</Box>{" remaining tasks on "}<Box component={"span"} sx={{color: 'secondary.light'}}>{totalTasks}</Box>{((user?.boards.length || 1) == 1 ? " board." : "boards.")}</Typography>
            <Typography sx={{color: 'primary.main'}} variant="h1">{"Yesterday you completed "}<Box component={"span"} sx={{color: 'secondary.light'}}>{tasksCompletedYesterday}</Box>{(tasksCompletedYesterday == 1 ? " task." : " tasks.") }</Typography>
            <Typography sx={{color: 'primary.main'}} variant="h1">{"In the last week you have completed "}<Box component={"span"} sx={{color: 'secondary.light'}}>{tasksCompletedThisWeek}</Box>{(tasksCompletedThisWeek == 1 ? " task." : " tasks.") }</Typography>
            <Button variant='contained' sx={{marginTop: '25px'}}>
                <Typography variant="h3" sx={{color: 'background.paper'}}>Go to dashboard&nbsp;</Typography>
                <EastIcon />
            </Button>

        </Box>
    )

}