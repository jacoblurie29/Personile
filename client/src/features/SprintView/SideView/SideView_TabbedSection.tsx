import { Box, Button, Card, Checkbox, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import { formatDateString } from "app/util/dateUtil";
import InfoIcon from '@mui/icons-material/Info';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useState } from "react";
import { Task } from "app/models/task";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PunchClockIcon from '@mui/icons-material/PunchClock';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function SideViewTabbedSection() {

    // redux state
    const { currentBoard } = useAppSelector(state => state.sprintView);
    const boards = useAppSelector(state => state.user.userData?.boards);
    const board = boards?.find(b => b.boardEntityId == currentBoard)

    // react state and theme
    const [currentTab, setCurrentTab] = useState<number>(0);
    const theme = useTheme();

    // populate the milestone headers with their tasks
    const getTasksForMilestone = (milestoneId: string) => {

        // obtain sprint object and null check
        var sprints = board?.sprints;
        if (sprints == undefined) return;

        // base task array
        var Tasks = [] as Task[];
        
        sprints.map(sprint => {
            sprint.tasks.map(task => {
                if(task.milestoneIds.includes(milestoneId)) {
                    Tasks.push(task);
                }
            })
        });

        // Sort tasks based on current state
        Tasks.sort((a, b) => {
            return a.currentState - b.currentState;
        })
        
        return Tasks;
    }

    // styles for tasks in milestone
    const getMilestoneTaskBorders = (index: number, tasks: Task[]) => {
        if(index === 0 && tasks.length > 1) return '5px 5px 0 0';
        if(index === 0 && tasks.length <= 1) return '5px';
        if(index !== 0 && tasks.length === index + 1) return '0 0 5px 5px';
        return '0px';
    }

    return (

        <Card  sx={{background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, height: '100%', width: '100%'}}>
            <Grid container columns={12}> 
                <Grid item xs={3}>
                    <Button onClick={() => setCurrentTab(0)} fullWidth sx={{height: '50px', borderRadius: '0px', backgroundColor: currentTab === 0 ? 'rgba(0,0,0,0)' : 'background.paper', ":hover": {backgroundColor: currentTab !== 0 ? 'grey.200' : "rgba(0,0,0,0)"}}}><InfoIcon sx={{ color: currentTab === 0 ? 'background.paper' : 'primary.dark'}}/></Button>
                </Grid>
                <Grid item xs={3}>
                    <Button onClick={() => setCurrentTab(1)} fullWidth sx={{height: '50px', borderRadius: '0px', backgroundColor: currentTab === 1 ? 'rgba(0,0,0,0)' : 'background.paper', ":hover": {backgroundColor: currentTab !== 1 ? 'grey.200' : "rgba(0,0,0,0)"}}}><EventAvailableIcon sx={{ color: currentTab === 1 ? 'background.paper' : 'primary.dark'}}/></Button>
                </Grid>
                <Grid item xs={3}>
                    <Button onClick={() => setCurrentTab(2)} fullWidth sx={{height: '50px', borderRadius: '0px', backgroundColor: currentTab === 2 ? 'rgba(0,0,0,0)' : 'background.paper', ":hover": {backgroundColor: currentTab !== 2 ? 'grey.200' : "rgba(0,0,0,0)"}}}><MessageIcon sx={{ color: currentTab === 2 ? 'background.paper' : 'primary.dark'}}/></Button>
                </Grid>
                <Grid item xs={3}>
                    <Button onClick={() => setCurrentTab(3)} fullWidth sx={{height: '50px', borderRadius: '0px', backgroundColor: currentTab === 3 ? 'rgba(0,0,0,0)' : 'background.paper', ":hover": {backgroundColor: currentTab !== 3 ? 'grey.200' : "rgba(0,0,0,0)"}}}><SettingsIcon sx={{ color: currentTab === 3 ? 'background.paper' : 'primary.dark'}}/></Button>
                </Grid>
            </Grid>
            {currentTab === 0 ? 
                <Box sx={{padding: '20px'}}>
                <Typography variant='h3' sx={{color: 'background.paper', marginBottom: '5px'}}>Board name:</Typography>
                <Typography variant='h5' sx={{color: 'background.paper', fontWeight: 200}}>&nbsp;&nbsp;&nbsp;{board?.name}</Typography>
                <Divider sx={{backgroundColor: 'grey.300', marginTop: '10px', marginBottom: '10px'}} />
                <Typography variant='h3' sx={{color: 'background.paper', marginBottom: '5px'}}>Description:</Typography>
                <Typography variant='h4' sx={{color: 'background.paper', fontWeight: 200}}>&nbsp;&nbsp;&nbsp;{board?.description}</Typography>
                <Divider sx={{backgroundColor: 'grey.300', marginTop: '10px', marginBottom: '10px'}} />
                <Typography variant='h3' sx={{color: 'background.paper', marginBottom: '5px'}}>Start date:</Typography>
                <Typography variant='h4' sx={{color: 'background.paper', fontWeight: 200}}>&nbsp;&nbsp;&nbsp;{formatDateString(board?.startDate || "")}</Typography>
                <Divider sx={{backgroundColor: 'grey.300', marginTop: '10px', marginBottom: '10px'}} />
                <Typography variant='h3' sx={{color: 'background.paper', marginBottom: '5px'}}>End date:</Typography>
                <Typography variant='h4' sx={{color: 'background.paper', fontWeight: 200}}>&nbsp;&nbsp;&nbsp;{board?.endDate !== "" && formatDateString(board?.endDate || "")}</Typography>
                <Divider sx={{backgroundColor: 'grey.300', marginTop: '10px', marginBottom: '10px'}} />
                <Typography variant='h3' sx={{color: 'background.paper', marginBottom: '5px'}}>Sprint length:</Typography>
                <Typography variant='h4' sx={{color: 'background.paper', fontWeight: 200}}>&nbsp;&nbsp;&nbsp;{board?.sprintDaysLength}&nbsp;Days</Typography>
                <Divider sx={{backgroundColor: 'grey.300', marginTop: '10px', marginBottom: '10px'}} />
                <Typography variant='h3' sx={{color: 'background.paper', marginBottom: '5px'}}>Goals:</Typography>
                <List dense>
                    {board?.goals.map((goal, index) => (
                        <ListItem key={"goal" + index}>
                                <Typography variant='h4' sx={{color: 'background.paper', fontWeight: 200}}>&nbsp;&nbsp;&nbsp;<b>&#8226;</b>&nbsp;{goal.details}&nbsp;</Typography>
                        </ListItem>
                    ))}
                </List>
            </Box>

            : currentTab === 1 ?

                <Box sx={{padding: '20px'}}>
                    <Typography variant='h3' sx={{color: 'background.paper', marginBottom: '5px'}}>Milestones:</Typography>
                    <List dense>
                        {board?.milestones.map((milestone, index) => (
                            <div key={"milestoneOuterDiv" + index}>
                                {index !== 0 && <Divider sx={{backgroundColor: 'grey.300', marginTop: '10px', marginBottom: '10px'}} />}
                                <ListItem  sx={{paddingLeft: '0px'}} secondaryAction={<Checkbox checked={getTasksForMilestone(milestone.milestoneEntityId)?.every(t => t.currentState === 2)} />}>
                                        <Typography variant='h4' sx={{color: 'background.paper', fontWeight: 200}}>&nbsp;&nbsp;&nbsp;&nbsp;{milestone.description}&nbsp;<br />{milestone.dueDate !== "" && <Typography variant="caption" sx={{marginLeft: '40px', color: 'background.paper'}}>{milestone.hardDeadline ? "Due Date:" : "Goal:"}&nbsp;{milestone.dueDate.substring(0, 15)}</Typography>}</Typography>
                                </ListItem>
                                <ListItem  sx={{paddingLeft: '20px'}}>
                                    <Grid container>
                                        {getTasksForMilestone(milestone.milestoneEntityId)?.map((task, index) => (
                                            <Grid item key={'milestone' + index} xs={12} sx={{padding: '5px', backgroundColor: 'background.paper', borderBottom: index + 1 !== getTasksForMilestone(milestone.milestoneEntityId)?.length ? "1px solid lightgrey" : "",
                                            borderRadius: getMilestoneTaskBorders(index, getTasksForMilestone(milestone.milestoneEntityId) || []) }}>
                                                <Grid container alignItems='center' padding='2px'>
                                                    <Grid item xs={1} height='20px'>
                                                    </Grid>
                                                    <Grid item xs={10} height='20px'>
                                                        <Typography variant='subtitle1' sx={{color: 'primary.main', textAlign: 'center'}}>{task.name}</Typography>
                                                    </Grid>
                                                    <Grid item xs={1} height='20px'>
                                                        {task.currentState === 0 ? <HighlightOffIcon sx={{fontSize: '20px', color: 'error.main'}}/> : task.currentState === 1 ? <PunchClockIcon sx={{fontSize: '20px', color: 'warning.dark'}} /> : <CheckCircleOutlineIcon sx={{fontSize: '20px', color: 'success.main'}}  />}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </ListItem>
                            </div>
                        ))}
                    </List>
                </Box>

            : null      
            }

        </Card>

    )
}