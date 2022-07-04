import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AppRouter from '../routing/AppRouter';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const drawerWidth = 240;

const navButtonStyles = {
  display: 'block',
  color: 'inherit',
  typography: 'h6',
  '&.active': {
    backgroundColor: '#CCCCCC'
  }
}

const sprintLinks = [
  {linkTitle: "Today", linkRoute: '/today'},
  {linkTitle: "Sprint", linkRoute: '/sprint'},
  {linkTitle: "Future", linkRoute: '/future'}
]

const adminLinks = [
  {linkTitle: "Profile", linkRoute: "/profile"},
  {linkTitle: "Settings", linkRoute: "/settings"},
  {linkTitle: "Logout", linkRoute: "/logout"}
]

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);


export default function Navigation() {

  const [open, setOpen] = useState(false); 

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };


  return (
    <Box sx={{ display: 'flex', background: 'linear-gradient(352deg, rgba(7,20,22,1) 0%, rgba(13,37,41,1) 100%)' }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open} >
        <DrawerHeader>
          <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
            {!open ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {sprintLinks.map(({linkTitle, linkRoute}, index) => (
            <ListItem key={linkRoute}
                      disablePadding 
                      sx={navButtonStyles}
                      component={NavLink}
                      to={linkRoute}>
                      
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}         
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index === 0 ? <TodayIcon /> : index === 1 ? <DateRangeIcon /> : <AccessTimeIcon />}
                </ListItemIcon>
                <ListItemText primary={linkTitle} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {adminLinks.map(({linkTitle, linkRoute}, index) => (
            <ListItem key={linkRoute} 
                      disablePadding
                      component={NavLink}
                      to={linkRoute}
                      sx={navButtonStyles}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index === 0 ? <AccountBoxIcon /> : index === 1 ? <SettingsIcon /> : <LogoutIcon />}
                </ListItemIcon>
                <ListItemText primary={linkTitle} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, height: '100vh' }}>
        {/* Below handles the routing */}
          <AppRouter />         
      </Box>
    </Box>
  );
}