import { Box, Card, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material"
import { Board } from "app/models/board"
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LoadingButton } from "@mui/lab";
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';
import { useAppDispatch } from "app/store/configureStore";
import { setCurrentBoard } from "features/SprintView/sprintSlice";
import { useHistory } from "react-router-dom";

interface Props {
    board: Board
}

export default function BoardCard({board}: Props) {

    const dispatch = useAppDispatch();
    const history = useHistory();

    const handleOpenBoard = (boardId: string) => {
        dispatch(setCurrentBoard(boardId));
        history.push('/sprint')
    }

    return (

        <Card sx={{width: '90%', margin: 'auto'}}>
            <Grid container>
                <Grid item xs={8}>
                    <Typography variant="h2" sx={{paddingTop: '10px', paddingLeft: '10px'}}>{board.name}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Grid container width='fit-content' spacing={1} paddingTop='10px'>
                        <Grid xs={4} item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Box height='30px' width="30px" borderRadius='30px' sx={{backgroundColor: 'error.light'}}>
                                <Typography variant="h5" color='background.paper' textAlign='center' paddingTop='20%'>4</Typography>
                            </Box>
                        </Grid>
                        <Grid xs={4} item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Box height='30px' width="30px" borderRadius='30px' sx={{backgroundColor: 'warning.light'}} textAlign='center'>
                                <Typography variant="h5" color='background.paper' textAlign='center' paddingTop='20%'>6</Typography>
                            </Box>
                        </Grid>
                        <Grid xs={4} item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Box height='30px' width="30px" borderRadius='30px' sx={{backgroundColor: 'success.light'}}>
                                <Typography variant="h5" color='background.paper' textAlign='center' paddingTop='20%'>3</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Typography variant="h5" sx={{paddingLeft: '10px', paddingTop:'5px'}}>{board.description}</Typography>
            <br />
            <Divider />
            <br />
            <Typography variant="h5" sx={{paddingLeft: '20px'}}>Goals:</Typography>
            <List dense={true} disablePadding={true} sx={{paddingBottom: '10px'}}>
              {board.goals.map((goal, index) =>
                <ListItem key={"listItem-" + index}>
                  <ListItemIcon>
                    {goal.status === "Incomplete" ? <TimerIcon sx={{color: 'warning.dark'}} /> : <CheckCircleIcon sx={{color: 'success.main'}}/>}
                  </ListItemIcon>
                  <ListItemText
                    primary={goal.details}
                  />
                </ListItem>,
              )}
            </List>
            <Box sx={{flexGrow: 1, textAlign: 'center'}}>
                <LoadingButton key={"edit-" + board.boardEntityId} variant='contained' sx={{background: "linear-gradient(232deg, rgba(173,173,173,1) 0%, rgba(158,158,158,1) 100%)", borderRadius:"0px", width: '50%'}} ><EditIcon sx={{color: 'background.paper'}}/></LoadingButton>
                <LoadingButton key={"delete-" + board.boardEntityId} variant='contained' sx={{borderRadius:"0px", background:'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)', width: '50%'}} onClick={() => {handleOpenBoard(board.boardEntityId)}}><LaunchIcon sx={{color: 'background.paper'}} /></LoadingButton>
            </Box>
        </Card>

    )
}