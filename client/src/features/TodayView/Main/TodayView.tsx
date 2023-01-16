import { Box, Grid } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import CurrentWidgetCard from "../CurrentWidget/CurrentWidget_Card";
import ProgressWidgetCard from "../ProgressWidget/ProgressWidget_Card";
import RecentActivityCard from "../RecentWidget/RecentWidget_Card";
import TimerWidgetCard from "../TimerWidget/TimerWidget_Card";
import TodayWidgetCard from "../TodayWidget/TodayWidget_Card";
import UpcomingWidgetCard from "../UpcomingWidget/UpcomingWidget_Card";

interface TimerProps {
  seconds: number;
  minutes: number;
  pause: () => void;
  restartTimer: () => void;
  resume: () => void;
  currentMax: number;
  isRunning: boolean;
}

export default function TodayView({
  seconds,
  minutes,
  pause,
  restartTimer,
  resume,
  currentMax,
  isRunning,
}: TimerProps) {
  const boards = useAppSelector((state) => state.user.userData?.boards) || [];

  const cardStyles = {
    margin: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxHeight: "100%",
  };

  const xLargeCardSize = 6;
  const largeCardSize = 6;
  const mediumCardSize = 9;
  const xSmallCardSize = 18;
  const cardHeight = "360px";

  return (
    <Box height={"85%"} sx={{ margin: "10px" }}>
      <Grid container columns={19}>
        <Grid
          item
          height={cardHeight}
          xs={xSmallCardSize}
          md={mediumCardSize}
          lg={largeCardSize}
          xl={xLargeCardSize}
          sx={cardStyles}
        >
          <CurrentWidgetCard boards={boards} />
        </Grid>
        <Grid
          item
          height={cardHeight}
          xs={xSmallCardSize}
          md={mediumCardSize}
          lg={largeCardSize}
          xl={xLargeCardSize}
          sx={cardStyles}
        >
          <ProgressWidgetCard boards={boards} />
        </Grid>
        <Grid
          item
          height={cardHeight}
          xs={xSmallCardSize}
          md={mediumCardSize}
          lg={largeCardSize}
          xl={xLargeCardSize}
          sx={cardStyles}
        >
          <UpcomingWidgetCard boards={boards} />
        </Grid>
        <Grid
          item
          height={cardHeight}
          xs={xSmallCardSize}
          md={mediumCardSize}
          lg={largeCardSize}
          xl={xLargeCardSize}
          sx={cardStyles}
        >
          <TodayWidgetCard boards={boards} />
        </Grid>
        <Grid
          item
          height={cardHeight}
          xs={xSmallCardSize}
          md={mediumCardSize}
          lg={largeCardSize}
          xl={xLargeCardSize}
          sx={cardStyles}
        >
          <RecentActivityCard boards={boards} />
        </Grid>
        <Grid
          item
          height={cardHeight}
          xs={xSmallCardSize}
          md={mediumCardSize}
          lg={largeCardSize}
          xl={xLargeCardSize}
          sx={cardStyles}
        >
          <TimerWidgetCard
            seconds={seconds}
            minutes={minutes}
            pause={pause}
            restartTimer={restartTimer}
            resume={resume}
            currentMax={currentMax}
            isRunning={isRunning}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
