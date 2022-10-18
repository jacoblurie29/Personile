import { Box, Grid, Typography } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface Props {
    currentState: number,
    title: string,
    description: string
}

export default function TaskStateTitle({currentState, title, description}: Props) {

    const stateStyles = {
        background: currentState === 0 
        ? 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)' 
        : currentState === 1 ? 'linear-gradient(90deg, rgba(255,209,125,1) 0%, rgba(255,196,54,1) 100%)' 
        : 'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)',
        borderRadius: '8px',
        padding: '7px'}

    return (
        <Grid container display='flex' flexGrow={1} sx={{padding: '5px'}} >
            <Grid item lg={6} md= {12}
                    display="flex" 
                    alignItems="center"
                    justifyContent="flex-start">
                <Box sx={stateStyles}
                display="flex" alignItems="center" flexDirection="column">
                {currentState === 0 ? <HighlightOffIcon sx={{fontSize: '35px', color: 'grey.50'}}/> : currentState === 1 ? <PunchClockIcon sx={{fontSize: '35px', color: 'grey.50'}} /> : <CheckCircleOutlineIcon sx={{fontSize: '35px', color: 'grey.50'}} />}
                </Box>
                <Typography sx={{color: "grey.800", fontSize: '20px', pl: '5%'}}>{title}</Typography>
            </Grid>
            <Grid item paddingRight='5px' lg={6} display={{xl: 'flex', lg: "flex", md: "none", sm: "none", xs: "none"}} alignItems="center">
                <Typography sx={{ fontSize: 14, marginLeft: '4%', width:'90%' }} color="grey.500">
                    {description}
                </Typography> 
            </Grid>
        </Grid>
    )
}