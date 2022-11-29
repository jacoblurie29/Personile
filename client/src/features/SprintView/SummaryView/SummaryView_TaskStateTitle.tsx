import { Box, Grid, Typography } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';

interface Props {
    currentState: number,
    title: string,
    description: string
}

export default function TaskStateTitle({currentState, title, description}: Props) {


    return (
        <Grid container display='flex' flexGrow={1} sx={{margin: 'auto'}} >
            <Grid item lg={6} md= {12}
                    display="flex" 
                    alignItems="center"
                    marginTop='12px'
                    justifyContent="flex-start">
                {currentState === 0 ? <ClearIcon sx={{fontSize: '35px', color: 'error.main'}}/> : currentState === 1 ? <HourglassBottomIcon sx={{fontSize: '35px', color: 'warning.main'}} /> : <CheckIcon sx={{fontSize: '35px', color: 'success.main'}} />}
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