import { Box, Button, Card, CircularProgress, CircularProgressProps, circularProgressClasses, Grid, Typography } from "@mui/material";

interface Props {
    seconds: number,
    minutes: number,
    pause: () => void,
    restartTimer: () => void,
    resume: () => void,
    isRunning: boolean
    currentMax: number
}

export default function TimerWidgetCard({seconds, minutes, pause, restartTimer, resume, currentMax, isRunning}: Props) {



      function CircularProgressWithLabel(
        props: CircularProgressProps & { value: number, print: string },
      ) {
        return (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" size={155} {...props} value={100} sx={{
                color: "grey.200",
                position: 'absolute',
                left: 0,
            }}/>
            <CircularProgress variant="determinate" size={155} {...props} sx={{
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
        <Card elevation={0} sx={{height: '95%', width: '95%', overflowY: 'auto', borderRadius: '25px', border: '1px solid', borderColor: 'grey.400', padding: '20px'}}>
            <Typography variant="h2" sx={{margin: '10px 0px 5px 10px', color: 'grey.600'}}>{"Focus Timer"}</Typography>
            <Box sx={{paddingTop: '10px'}}>
                <Box sx={{textAlign: 'center', display: 'flex', justifyContent: 'center', paddingBottom: '10px'}}>
                    <CircularProgressWithLabel value={100 - (((seconds + (minutes * 60)) /  (currentMax * 60)) * 100)} print={minutes + ":" + (seconds < 10 ? "0" + seconds : seconds)} />
                </Box>
                <Typography variant="h5" sx={{color: !isRunning ? "grey.600" : currentMax == 25 ? "success.dark" : "error.dark", textAlign: 'center', paddingBottom: '20px'}}>{!isRunning ? "Paused" : currentMax == 25 ? "Work!" : "Rest!"}</Typography>
                <Box sx={{textAlign: 'center', display: 'flex', justifyContent: 'center'}}>
                    <Button variant="contained" onClick={pause}>Pause</Button>
                    <Button sx={{margin: '0px 10px'}} variant="contained" onClick={resume}>Go!</Button>
                    <Button variant="contained" onClick={() => {
                        // Restarts to 25 minutes timer
                        const time = new Date();
                        time.setSeconds(time.getSeconds() + 25 * 60);
                        restartTimer();
                        pause();
                    }}>Reset</Button>
                </Box>
            </Box>

        </Card>
    )
}