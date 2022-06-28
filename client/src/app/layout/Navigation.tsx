import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
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
import { FormControl, Select, MenuItem, SelectChangeEvent, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import agent from '../api/agent';
import { Task } from '../models/task';

const drawerWidth = 240;

const navButtonStyles = {
  display: 'block',
  color: 'inherit',
  typography: 'h6',
  '&.active': {
    backgroundColor: '#DCDCDC'
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

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
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

  const [loading, setLoading] = useState(true);
  const [sprint, setSprint] = useState<string>();
  const [sprints, setSprints] = useState<string[]>([]);
  const [tasks, setTasks] = useState<Task[]>();

  const handleSprintChange = (event: SelectChangeEvent) => {
      setSprint(event.target.value);
      var currentSprint = event.target.value;
      agent.Sprint.tasks(currentSprint).then(response => setTasks(response));
  }

  useEffect(() => {
      agent.Sprint.titles()
      .then(response => {
          setSprints(response);

          // setSprints state function is asyncronous so a local variable must be introduced
          var currentSprint = ""
          if (sprints) {

            // HERE is where the current sprint will have to be figured out
            setSprint(response[0]);
            currentSprint = response[0];
          }
          agent.Sprint.tasks(currentSprint).then(response => setTasks(response));
        })
      .finally(() => setLoading(false))
      
  }, [])


  const theme = useTheme();
  const [open, setOpen] = useState(false); 

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  if (loading) return <CircularProgress />

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">
             THIS PAGE
          </Typography>
          <Typography variant="h6" sx={{flexGrow: 1, textAlign: 'right', verticalAlign: "middle", mr: '20px'}}>
              <FormControl sx={{m: 1, minWidth: "120px"}}>
                <Select
                    value={sprint!}
                    onChange={handleSprintChange}
                    displayEmpty
                    sx={{ backgroundColor: 'white'}}
                >
                    {sprints?.map((title, index) => (
                        <MenuItem key={index} value={title}>{title}</MenuItem>
                    ))}
                </Select>
            </FormControl>
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
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
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {/* Below handles the routing */}
        <AppRouter tasks={tasks || []}/>        
      </Box>
    </Box>
  );
}