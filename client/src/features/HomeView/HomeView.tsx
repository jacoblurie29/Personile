import { makeStyles, AppBar, Toolbar, IconButton, Collapse, Box, Typography, Zoom, Grid, Button } from "@mui/material";
import SortIcon from '@mui/icons-material/Sort';
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import LoginView from "features/AccountViews/LoginView";


export default function Header() {
  const [checked, setChecked] = useState(false);
  const history = useHistory();
  useEffect(() => {
    setChecked(true);
  }, []);


  return (
    <Box sx={{  flex: 1,
                margin: '0px',
                padding: '0px',
                display: 'flex',
                height: '100vh',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Nunito',
                backgroundColor: 'primary.main',
                overflow: 'auto' }}>
      <AppBar sx={{background: 'none'}} elevation={0}>
        <Toolbar sx={{ width: '80%', margin: '0 auto'}}>
          <Typography variant="h1" sx={{flexGrow: '1'}}>
            <Box sx={{color: 'secondary.light'}}>Personile.</Box>
          </Typography>
          <IconButton>
            <SortIcon sx={{ color: 'secondary.light', fontSize: '2rem'}} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Collapse
        in={checked}
        {...(checked ? { timeout: 1000 } : {})}
      >
        <Box sx={{ textAlign: 'center'}}>
          <Typography variant='h1' sx={{color: '#fff', fontSize: '4.5rem'}}>
            Welcome to <br />
            <Box sx={{color: 'secondary.light'}}>Personile.</Box>
          </Typography>
            <Zoom in={checked}>
                <Button  sx={{margin: '10px', color: 'white', background: "linear-gradient(232deg, rgba(173,173,173,1) 0%, rgba(158,158,158,1) 100%)", borderRadius:"5px"}} onClick={() => history.push('/login')}>Login</Button>
            </Zoom>
            <Zoom in={checked}>
                <Button  sx={{margin: '10px', color: 'white', background: "linear-gradient(232deg, rgba(173,173,173,1) 0%, rgba(158,158,158,1) 100%)", borderRadius:"5px"}} onClick={() => history.push('/register')}>Register</Button>
            </Zoom>
        </Box>
      </Collapse>
      
    </Box>
  );
}