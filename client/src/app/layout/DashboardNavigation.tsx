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
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import SprintView from 'features/SprintView/Main/Main_SprintView';
import TodayView from 'features/TodayView/TodayView';
import NotFound from 'app/errors/NotFound';
import ServerError from 'app/errors/ServerError';
import SettingsView from 'features/SettingsView/SettingsView';
import { useAppDispatch, useAppSelector } from 'app/store/configureStore';
import LoadingComponent from './LoadingComponent';
import { signOut } from 'app/state/userSlice';
import BoardView from 'features/BoardsView/Main/Main_BoardView';
import { Typography } from '@mui/material';
import TopView_LayoutBox from 'features/SprintView/TopView/TopView_LayoutBox';

const drawerWidth = 230;

const navButtonStyles = {
  display: 'block',
  color: 'inherit',
  borderRadius: '16px',
  width: '80%',
  marginLeft: '10px',
  typography: 'h4',
  '&.active': {
    color: "primary.dark",
    backgroundColor: 'primary.light'
  }
}

const sprintLinks = [
  {linkTitle: "Today", linkRoute: '/today'},
  {linkTitle: "Sprint", linkRoute: '/sprint'},
  {linkTitle: "Boards", linkRoute: '/boards'}
]

const adminLinks = [
  {linkTitle: "Profile", linkRoute: "/profile"},
  {linkTitle: "Settings", linkRoute: "/settings"},
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
    width: `calc(${theme.spacing(8)} + 5px)`,
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

interface Props {
  component: string
}

export default function DashboardNavigation({component}: Props) {

  const [open, setOpen] = useState(false); 

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const dispatch = useAppDispatch();

  const {loading} = useAppSelector(state => state.sprintView);


  return (
    <Box overflow='auto' height='100vh' sx={{ display: 'flex' }}>
      <Drawer variant="permanent" open={open} 
            sx={{"& .MuiPaper-root": {
              border: '0px'
            }}} >
        <DrawerHeader>
          <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
            {!open ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <List>
          {sprintLinks.map(({linkTitle, linkRoute}, index) => (
            <ListItem key={linkRoute}
                      disablePadding 
                      sx={navButtonStyles}
                      component={NavLink}
                      to={linkRoute}
                      >
                      
              <ListItemButton
                sx={{
                  minHeight: 24,
                  justifyContent: open ? 'initial' : 'center',
                  borderRadius: '16px'
                }}         
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 5 : 'auto',
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
        <List>
          {adminLinks.map(({linkTitle, linkRoute}, index) => (
            <ListItem key={linkRoute} 
                      disablePadding
                      component={NavLink}
                      to={linkRoute}
                      sx={navButtonStyles}>
              <ListItemButton
                sx={{
                  minHeight: 24,
                  justifyContent: open ? 'initial' : 'center',
                  borderRadius: '16px'
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 5 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index === 0 ? <AccountBoxIcon /> : <SettingsIcon /> }
                </ListItemIcon>
                <ListItemText primary={linkTitle} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem key={'logout'} 
                      disablePadding
                      sx={navButtonStyles}>
              <ListItemButton
                sx={{
                  minHeight: 24,
                  justifyContent: open ? 'initial' : 'center',
                  borderRadius: '16px'
                }}
                onClick={() => dispatch(signOut())}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 5 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, height: '100vh'}} paddingLeft='5px'>
        <Box sx={{backgroundColor: 'background.default', width: '100%', height: '8%'}}>     
          {!loading && component === "sprint" && <TopView_LayoutBox />}
        </Box>
        {/* Below handles the routing */}
          {loading && <LoadingComponent />}       
          {!loading && component === "sprint" && <SprintView />}
          {!loading && component === "today" && <TodayView />}
          {!loading && component === "boards" && <BoardView />}
          {!loading && component === "settings" && <SettingsView />}
          {!loading && component === "serverError" && <ServerError />}
          {!loading && component === "notFound" && <NotFound />} 
      </Box>
    </Box>
  );
}