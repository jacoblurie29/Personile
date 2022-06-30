import { Button, Container, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function NotFound() {
    return (
        <Container component={Paper} sx={{display: 'flex', height: 400, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}} >
            <ErrorOutlineIcon color='error'sx={{fontSize: '100px', paddingBottom:'10px'}}/>
            <Typography gutterBottom variant="h3">Oops!</Typography>
            <Typography sx={{paddingBottom:'10px'}} gutterBottom variant="h6">We couldn't find what you are looking for</Typography>
            <Button variant='contained' component={Link} to='/'>Go back to sprint</Button>
        </Container>

    )
}