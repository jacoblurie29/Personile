import { Card, Grid, TextField, Typography } from "@mui/material";
import WhiteTransparentTextField from "./WhiteTransparentTextField";

export default function NewTaskCardView() {

    return (
        <Card elevation={1} sx={{background: 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)', marginTop: '10px', marginBottom: '10px'}}>
            <Typography variant="h6" margin="5% 6% 20px 6%" sx={{color: 'white', fontFamily:'Open Sans', fontWeight:'700', fontSize:'22px'}}>New Task</Typography>
            <Grid container margin='10px' columns={24}>
                <Grid item xs={21}>
                    <WhiteTransparentTextField label="Task Name" />
                    <WhiteTransparentTextField label="Description" lines={4}/>
                </Grid>
            </Grid>
        </Card>
    )
}