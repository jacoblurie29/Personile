import { Box, Card, Typography } from "@mui/material"
import agent from "app/api/agent";
import { ActivityEvent } from "app/models/activityEvent";
import { Board } from "app/models/board"
import { getRecentActivityAsync } from "app/state/userSlice";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { convertDateAndTimeStringToSeconds, convertTimeStringToSeconds } from "app/util/dateUtil";
import { useEffect } from "react";
import RecentWidgetActivityCard from "./RecentWidget_ActivityCard";
import RecentWidgetLoadingComponent from "./RecentWidget_LoadingComponent";

interface Props {
    boards: Board[]
}

export default function RecentActivityCard({boards}: Props)  {

    const userId = useAppSelector(state => state.user.userData?.userEntityId);
    const recentActivity = useAppSelector(state => state.user.recentActivity) || [];
    const status = useAppSelector(state => state.user.status);
    const dispatch = useAppDispatch();

    useEffect(() => {
        /*
            Load the activity here and present a loading icon in the widget.
            I am doing this rather than messing with the redux state because this
            tile will be affected by multiple users and using redux would therefore be inefficienct
            because it would only reflect other user's changes upon a full refresh.
        */
        if(userId == null) return; 
        dispatch(getRecentActivityAsync({userId: userId}))
    }, [])

    return (
        <Card elevation={0} sx={{height: '95%', width: '95%', overflowY: 'auto', borderRadius: '25px', border: '1px solid', borderColor: 'grey.400', padding: '20px'}}>
            <Typography variant="h2" sx={{margin: '10px 0px 5px 10px', color: 'grey.600'}}>Recent Activity</Typography>

                {status.includes("pendingGetRecentActivity") ? 
                    <RecentWidgetLoadingComponent />
                :
                    <Box sx={{ overflowY: 'auto', maxHeight: '75%' }}>
                    {
                        [...recentActivity]?.sort((a,b) => convertDateAndTimeStringToSeconds(a.date, a.time) - convertDateAndTimeStringToSeconds(b.date, b.time)).reverse().map((event, index) => (
                            <RecentWidgetActivityCard event={event} index={index} max={recentActivity.length - 1} />
                        ))
                    }
                    </Box>
                }


        </Card>
    )
}