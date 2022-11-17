import { Box, Button, Card, CircularProgress, CircularProgressProps, circularProgressClasses, Grid, Typography } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import { useTimer, TimerSettings } from 'react-timer-hook';
import React, { useEffect, useState } from 'react';

export default function TimerWidgetCard() {

    const time = new Date();
    time.setSeconds(time.getSeconds() + 600); 

    const {
        seconds,
        minutes,
        pause,
        restart,
        resume,
      } = useTimer({ expiryTimestamp: time, onExpire: () => console.warn('onExpire called') });

      useEffect(() => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + 25 * 60);
        restart(time);
        pause();
      }, [])

      function CircularProgressWithLabel(
        props: CircularProgressProps & { value: number, print: string },
      ) {
        return (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" size={175} {...props} value={100} sx={{
                color: "grey.200",
                position: 'absolute',
                left: 0,
            }}/>
            <CircularProgress variant="determinate" size={175} {...props} sx={{
                color: "primary.main",
                [`& .${circularProgressClasses.circle}`]: {
                    strokeLinecap: 'round',
                    
                },
            }}/>
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="body1"
                fontSize="40px"
                component="div"
                color={"grey.600"}
              >{`${props.print}`}</Typography>
            </Box>
          </Box>
        );
      }
    


    return (
        <Card elevation={3} sx={{height: '95%', width: '95%', overflowY: 'auto'}}>
            <Typography variant="h2" sx={{margin: '10px 0px 5px 10px', color: 'grey.600'}}>{"Productivity Clock"}</Typography>
            <Box sx={{paddingTop: '15px'}}>
                <Box sx={{textAlign: 'center', display: 'flex', justifyContent: 'center', paddingBottom: '25px'}}>
                    <CircularProgressWithLabel value={100 - (((seconds + (minutes * 60)) /  (25 * 60)) * 100)} print={minutes + ":" + (seconds < 10 ? "0" + seconds : seconds)} />
                </Box>
                {/* <p>{isRunning ? 'Running' : 'Not running'}</p> */}
                <Box sx={{textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
                    <Button onClick={pause}>Pause</Button>
                    <Button onClick={resume}>Go!</Button>
                    <Button onClick={() => {
                        // Restarts to 25 minutes timer
                        const time = new Date();
                        time.setSeconds(time.getSeconds() + 25 * 60);
                        restart(time);
                        pause();
                    }}>Reset</Button>
                </Box>
            </Box>

        </Card>
    )
}