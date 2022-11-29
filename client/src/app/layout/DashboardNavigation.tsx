import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import { useTimer, TimerSettings } from 'react-timer-hook';
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
import TimerIcon from '@mui/icons-material/Timer';
import LogoutIcon from '@mui/icons-material/Logout';
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SprintView from 'features/SprintView/Main/Main_SprintView';
import TodayView from 'features/TodayView/Main/TodayView';
import NotFound from 'app/errors/NotFound';
import ServerError from 'app/errors/ServerError';
import SettingsView from 'features/SettingsView/SettingsView';
import { useAppDispatch, useAppSelector } from 'app/store/configureStore';
import LoadingComponent from './LoadingComponent';
import { signOut } from 'app/state/userSlice';
import BoardView from 'features/BoardsView/Main/Main_BoardView';
import { Typography } from '@mui/material';
import TopView_LayoutBox from 'features/SprintView/TopView/TopView_LayoutBox';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ProfileView from 'features/ProfileView/ProfileView';

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
  {linkTitle: "Dashboard", linkRoute: '/dashboard'},
  {linkTitle: "Sprint", linkRoute: '/sprint'},
  {linkTitle: "Boards", linkRoute: '/boards'}
]

const adminLinks = [
  {linkTitle: "Profile", linkRoute: "/profile"},
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

  const dispatch = useAppDispatch();
  const {loading} = useAppSelector(state => state.sprintView);

  const { currentBoard } = useAppSelector(state => state.sprintView);
  const boards = useAppSelector(state => state.user.userData?.boards);
  const user = useAppSelector(state => state.user.userData);
  const board = boards?.find(b => b.boardEntityId == currentBoard);
  const [currentSprintPage, setCurrentSprintPage] = useState<string>("sprint");
  const [open, setOpen] = useState(false); 
  const [currentTimerMax, setCurrentTimerMax] = useState<number>(25);
  

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const toggleSprintPageView = (pageSelection: string) => {
    setCurrentSprintPage(pageSelection);
}

const time = new Date();
time.setSeconds(time.getSeconds() + currentTimerMax * 60); 

const {
    seconds,
    minutes,
    pause,
    restart,
    resume,
    isRunning,
} = useTimer({ expiryTimestamp: time, onExpire: () => console.warn('onExpire called') });

useEffect(() => {
  pause();
}, [])

useEffect(() => {
  if(minutes == 0 && seconds == 0 && currentTimerMax == 25) {
    setCurrentTimerMax(5);
    restartTimerNum(5);
  } else if(minutes == 0 && seconds == 0 && currentTimerMax == 5) {
    setCurrentTimerMax(25);
    restartTimerNum(25);
  }
}, [minutes, seconds])

const restartTimer = () => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 25 * 60);
  setCurrentTimerMax(25);
  restart(time);
}

const restartTimerNum = (val: number) => {
  const time = new Date();
  time.setSeconds(time.getSeconds() + val * 60);
  restart(time);
}


  return (
    <Box overflow='auto' height='100vh' sx={{ display: 'flex', background: 'linear-gradient(132deg, rgba(233,252,255,1) 0%, rgba(255,255,255,1) 48%, rgba(244,232,255,1) 100%)' }}>
      <Drawer variant="permanent" open={open} 
            sx={{"& .MuiPaper-root": {
              border: '0px',
              backgroundColor: 'rgba(0,0,0,0)'
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
                  {index == 0 ? <HomeIcon />  : index === 1 ? <DateRangeIcon /> : <AccessTimeIcon />}
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
                  {<AccountBoxIcon />}
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
            {isRunning && 
            <Box sx={{paddingLeft: '10px', paddingTop: '40px', textAlign: 'center'}}>
              <TimerIcon sx={{color: currentTimerMax == 25 ? "success.dark" : "error.dark"}} />
              <Typography sx={{color: currentTimerMax == 25 ? "success.dark" : "error.dark"}} variant='h5'> {minutes + ":" + (seconds < 10 ? "0" + seconds : seconds)}</Typography>
              <Typography variant="h5" sx={{color: currentTimerMax == 25 ? "success.dark" : "error.dark", textAlign: 'center', paddingBottom: '20px'}}>{currentTimerMax == 25 ? "Work" : "Rest"}</Typography>
            </Box>
            }
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, height: '100vh'}} paddingLeft='5px'>
        {component !== 'profile' &&
        <Box sx={{width: '100%', height: '8%'}}>     
          {!loading && <TopView_LayoutBox setPage={toggleSprintPageView} component={component} title={component === "sprint" ? board?.name || "" : component === "dashboard" ? "Welcome back, " + user?.firstName : "Your boards"} />}
        </Box>
        }
        {/* Below handles the routing */}
          {loading && <LoadingComponent />}      
          {!loading && component === "sprint" && <SprintView page={currentSprintPage} />}
          {!loading && component === "dashboard" && <TodayView seconds={seconds} minutes={minutes} pause={pause} restartTimer={restartTimer} resume={resume} currentMax={currentTimerMax} isRunning={isRunning} />}
          {!loading && component === "boards" && <BoardView />}
          {!loading && component === "profile" && <ProfileView />}
          {!loading && component === "settings" && <SettingsView />}
          {!loading && component === "serverError" && <ServerError />}
          {!loading && component === "notFound" && <NotFound />} 
      </Box>
    </Box>
  );
}