import { Box, Grid } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import CurrentWidgetCard from "../CurrentWidget/CurrentWidget_Card";
import ProgressWidgetCard from "../ProgressWidget/ProgressWidget_Card";
import RecentActivityCard from "../RecentWidget/RecentWidget_Card";
import TimerWidgetCard from "../TimerWidget/TimerWidget_Card";
import TodayWidgetCard from "../TodayWidget/TodayWidget_Card";
import UpcomingWidgetCard from "../UpcomingWidget/UpcomingWidget_Card";

export default function TodayView() {

    const boards = useAppSelector(state => state.user.userData?.boards) || [];

    const cardStyles = {
        margin: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', maxHeight: '100%'
    }

    return (
        <Box height={'85%'} sx={{backgroundColor: '#D9E8F9', borderRadius: '15px', margin: '10px'}}>
            <Grid container height={'45%'} columns={19}>
                <Grid item xs={6} sx={cardStyles}>
                    <CurrentWidgetCard boards={boards} />
                </Grid>
                <Grid item xs={6} sx={cardStyles}>
                    <ProgressWidgetCard boards={boards} />
                </Grid>
                <Grid item xs={6} sx={cardStyles}>
                    <UpcomingWidgetCard boards={boards} />
                </Grid>
            </Grid>
            <Grid container height={'45%'} columns={19}>
                <Grid item xs={6} sx={cardStyles}>
                    <TodayWidgetCard boards={boards} />
                </Grid>
                <Grid item xs={6} sx={cardStyles}>
                    <RecentActivityCard boards={boards} />
                </Grid>
                <Grid item xs={6} sx={cardStyles}>
                    <TimerWidgetCard />
                </Grid>
            </Grid>
        </Box>
    )
}