import { Box, Grid, Typography } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface Props {
    currentState: number,
    title: string
}

export default function ViewTaskStateDisplay({currentState, title}: Props) {

    // invert colors on state selected
    const boxStyles = {
        background: currentState === 0 
        ? 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)' 
        : currentState === 1 ? 'linear-gradient(90deg, rgba(255,209,125,1) 0%, rgba(255,196,54,1) 100%)' 
        : 'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)',
        borderRadius: '8px',
        padding: '7px'
    }

    return (
        <Grid container display='flex' flexGrow={1} sx={{padding: '5px'}} >
            <Grid item paddingRight='5px' xs={6} display="flex" alignItems="center">
                <Typography sx={{color: "grey.800", fontSize: '20px', pl: '5%'}}>{title}</Typography>
            </Grid>
            <Grid item xs={6}
                      display="flex" 
                      alignItems="center"
                      justifyContent="flex-end" >
                <Box sx={boxStyles}
                display="flex" alignItems="center" flexDirection="column">
                {currentState === 0 ? <HighlightOffIcon sx={{fontSize: '35px', color: 'grey.50'}}/> : currentState === 1 ? <PunchClockIcon sx={{fontSize: '35px', color: 'grey.50'}} /> : <CheckCircleOutlineIcon sx={{fontSize: '35px', color: 'grey.50'}} />}
                </Box>
            </Grid>
        </Grid>
    )
}