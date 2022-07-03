import { Grid, Typography } from "@mui/material";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface Props {
    currentState: number
}

export default function TaskStateDialogDisplay({currentState}: Props) {

    return (
        <Grid container display='flex' flexGrow={1} justifyContent='flex-end'>
            <Grid item paddingRight='5px'>
                {currentState === 0 ? <HighlightOffIcon color="error"/> : currentState === 1 ? <PunchClockIcon color='warning' /> : <CheckCircleOutlineIcon color="success" />}
            </Grid>
            <Grid item>
                <Typography variant="body1">{currentState === 0 ? 'New' : currentState === 1 ? 'Active' : 'Completed'}</Typography>
            </Grid>
        </Grid>
    )
}