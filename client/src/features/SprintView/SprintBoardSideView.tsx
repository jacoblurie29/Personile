import { Box, Button, Card, Checkbox, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, Tab, Tabs, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import { formatDateString } from "app/util/dateUtil";
import InfoIcon from '@mui/icons-material/Info';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import { useState } from "react";

export default function SprintBoardSideView() {

    const { currentBoard } = useAppSelector(state => state.sprintView);
    const boards = useAppSelector(state => state.user.userData?.boards);
    const theme = useTheme();
    const board = boards?.find(b => b.boardEntityId == currentBoard)
    const [currentTab, setCurrentTab] = useState<number>(0);

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
                <Typography variant='h3' sx={{color: 'background.paper', marginBottom: '5px'}}>Goals:</Typography>
                <List dense>
                    {board?.goals.map((goal, index) => (
                        <ListItem>
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
                            <>
                                {index !== 0 && <Divider sx={{backgroundColor: 'grey.300', marginTop: '10px', marginBottom: '10px'}} />}
                                <ListItem  sx={{paddingLeft: '0px'}} secondaryAction={<Checkbox checked={milestone.status === "completed"} />}>
                                        <Typography variant='h4' sx={{color: 'background.paper', fontWeight: 200}}>&nbsp;&nbsp;&nbsp;&nbsp;{milestone.description}&nbsp;<br />{milestone.dueDate !== "" && <Typography variant="caption" sx={{marginLeft: '40px', color: 'background.paper'}}>{milestone.hardDeadline ? "Due Date:" : "Goal:"}&nbsp;{milestone.dueDate}</Typography>}</Typography>
                                </ListItem>
                            </>
                        ))}
                    </List>
                </Box>

            : null      
            }

        </Card>

    )
}