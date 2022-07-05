import { Box, Grid, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

interface Props {
    addNewTaskOnClick: () => void
}

export default function NewTaskButton({addNewTaskOnClick}: Props) {
    return (
        <Box sx={{backgroundColor: 'rgba(256,256,256,0)', border: '1px dashed rgba(231,104,72,1)', borderRadius: '5px', "&:hover": {cursor: 'pointer'}}} flexGrow={1} onClick={addNewTaskOnClick}>
            <Grid container flexGrow={1} alignItems='center' padding='7px'>
                <Grid item xs={6}>
                    <Typography variant="h6" sx={{color: 'rgba(231,104,72,1)', paddingLeft: '20px'}}>New Task</Typography>
                </Grid>
                <Grid item xs={6}>
                    <AddIcon  sx={{float: 'right', color: 'rgba(231,104,72,1)', pr: '10px', fontSize: '3em'}} />
                </Grid>
            </Grid>      
        </Box>
    )
}