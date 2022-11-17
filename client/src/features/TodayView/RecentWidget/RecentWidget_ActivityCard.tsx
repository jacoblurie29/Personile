import { Card, Typography } from "@mui/material";
import { ActivityEvent } from "app/models/activityEvent"

interface Props {
    event: ActivityEvent,
    index: number,
    max: number
}

export default function RecentWidgetActivityCard({event, index, max}: Props) {

    const calculateBorderRadius = (index: number) => {
        if(index == 0) {
            return '5px 5px 0px 0px';
        } else if (index == max) {
            return '0px 0px 5px 5px';
        } else {
            return '0px';
        }
    } 

    return (
        <Card elevation={1} sx={{width: '92%', border: '0.01px solid', borderColor: 'grey.400', margin: '0px 10px', padding:'4px 10px', borderRadius: calculateBorderRadius(index)}}>
            <Typography variant='h5'>{event.message}</Typography>
            <Typography variant='subtitle2'>User:&nbsp;{event.userName}</Typography>
            <Typography variant='subtitle2'>{event.date},&nbsp;{event.time}</Typography>
        </Card>
    )
}