import { Box, Card, Divider, Grid, List, ListItem, ListItemIcon, ListItemText, ToggleButton, ToggleButtonGroup, Zoom, Typography } from "@mui/material"
import { Board } from "app/models/board"
import TimerIcon from '@mui/icons-material/Timer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { LoadingButton } from "@mui/lab";
import EditIcon from '@mui/icons-material/Edit';
import LaunchIcon from '@mui/icons-material/Launch';
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { setCurrentBoard, setCurrentSprint } from "features/SprintView/sprintSlice";
import { useHistory } from "react-router-dom";
import CircleIcon from '@mui/icons-material/Circle';
import { formatDateString } from "app/util/dateUtil";

interface Props {
    board: Board,
    setNewBoardState: (value: boolean, board: Board) => void,
    indexForAnimation: number,
    animationBoolean: boolean
}

export default function BoardCard({board, setNewBoardState, indexForAnimation, animationBoolean}: Props) {

    const dispatch = useAppDispatch();
    const history = useHistory();
    const boards = useAppSelector(state => state.user.userData?.boards)

    const handleOpenBoard = (boardId: string) => {

      
        dispatch(setCurrentBoard(boardId));

        console.log(boards)
        
        var currentBoardSprints = boards?.find(b => b.boardEntityId === boardId)?.sprints;

        console.log(currentBoardSprints)

        if(currentBoardSprints === undefined) {
          return;
        }

        var setSprint =  currentBoardSprints.find(s => {
            return Date.parse(s.startDate || "") <= Date.parse(new Date().toString() + 8539999) && Date.parse(s.endDate || "") >= Date.parse(new Date().toString()) - 8539999
        })?.sprintEntityId; 


        if(setSprint === undefined) {
          return;
        }

        dispatch(setCurrentSprint(setSprint))

        history.push('/sprint')
    }

    return (
        <Zoom in={animationBoolean} timeout={(indexForAnimation + 1) * 300 } key={"boardCard-" + indexForAnimation}>  
          <Card sx={{width: '90%', margin: 'auto', height: 'fit-content'}}>
              <Grid container height='80px'>
                  <Grid item xs={8}>
                      <Typography variant="h2" sx={{paddingTop: '20px', paddingLeft: '20px'}}>{board.name}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                      <Grid container width='fit-content' spacing={1} paddingTop='10px' margin='auto' flexGrow={1}>
                          <Grid xs={4} item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                              <Box height='30px' width="30px" borderRadius='30px' sx={{backgroundColor: 'error.light'}}>
                                  <Typography variant="h5" color='background.paper' textAlign='center' paddingTop='20%'>{board.sprints[0]?.tasks.filter(t => t.currentState === 0).length || "0"}</Typography>
                              </Box>
                          </Grid>
                          <Grid xs={4} item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                              <Box height='30px' width="30px" borderRadius='30px' sx={{backgroundColor: 'warning.light'}} textAlign='center'>
                                  <Typography variant="h5" color='background.paper' textAlign='center' paddingTop='20%'>{board.sprints[0]?.tasks.filter(t => t.currentState === 1).length || "0"}</Typography>
                              </Box>
                          </Grid>
                          <Grid xs={4} item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                              <Box height='30px' width="30px" borderRadius='30px' sx={{backgroundColor: 'success.light'}}>
                                  <Typography variant="h5" color='background.paper' textAlign='center' paddingTop='20%'>{board.sprints[0]?.tasks.filter(t => t.currentState === 2).length || "0"}</Typography>
                              </Box>
                          </Grid>
                      </Grid>
                  </Grid>
              </Grid>
              <Typography variant="h5" sx={{paddingLeft: '20px'}}>{board.description}</Typography>
              <br />
              <Divider />
              <br />
              <Typography variant="h5" sx={{paddingLeft: '20px', paddingBottom: '5px'}}>Goals:</Typography>
              <List dense={true} disablePadding={true} sx={{paddingBottom: '10px', paddingLeft: '10px', paddingRight: '10px', height: '100px'}} >
                {board.goals.length > 0 ? board.goals.map((goal, index) =>
                  <ListItem key={"listItem-" + index} sx={{padding:"0px 0px 0px 20px"}}>
                    <ListItemText>
                      <CircleIcon sx={{color: 'grey.600', fontSize: '7px', marginRight: '4px'}} />  
                      {goal.details}
                    </ListItemText>
                  </ListItem>,
                ) : 
                  <Box flexGrow={1} height='100%' textAlign='center' margin= 'auto'>
                      <Typography variant="h5" sx={{color: 'grey.400', paddingTop: '25px'}}>&#40;No goals&#41;</Typography>
                  </Box>
                }
              </List>
              <Divider />
              <br />
              <Typography variant="h5" sx={{paddingLeft: '20px'}}>Milestones:</Typography>
              <List dense={true} disablePadding={true} sx={{paddingBottom: '10px', paddingLeft: '10px', paddingRight: '10px', height: '100px'}}>
                {board.milestones.length > 0 ? board.milestones.map((milestone, index) =>
                  <ListItem key={"listItem-" + index} sx={{width: '100%'}}>
                    <Typography variant="body2"
                    sx={{display: 'flex', marginRight: '10px'}}>
                      {milestone.status === "Incomplete" ? <TimerIcon sx={{color: 'warning.dark'}} /> : <CheckCircleIcon sx={{color: 'success.main'}}/>}
                    </Typography>
                    <Typography variant="body2" sx={{display: 'flex'}}>
                      {milestone.description}
                    </Typography>
                    <Typography variant="caption" marginLeft='auto' marginRight='10px' noWrap>
                      {milestone.dueDate !== "" ? (milestone.hardDeadline === true ? "Deadline: " : "Goal: ") + formatDateString(milestone.dueDate) : "No Goal"}
                    </Typography>
                  </ListItem>,
                ) : 
                <Box flexGrow={1} height='100%' textAlign='center' margin= 'auto'>
                    <Typography variant="h5" sx={{color: 'grey.400', paddingTop: '25px'}}>&#40;No milestones&#41;</Typography>
                </Box>
              }
              </List>
              <Box sx={{flexGrow: 1, textAlign: 'center'}}>
                  <LoadingButton key={"edit-" + board.boardEntityId} variant='contained' sx={{background: "linear-gradient(232deg, rgba(173,173,173,1) 0%, rgba(158,158,158,1) 100%)", borderRadius:"0px", width: '50%'}} onClick={() => setNewBoardState(true, board)} ><EditIcon sx={{color: 'background.paper'}}/></LoadingButton>
                  <LoadingButton key={"delete-" + board.boardEntityId} variant='contained' sx={{borderRadius:"0px", background:'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)', width: '50%'}} onClick={() => {handleOpenBoard(board.boardEntityId)}}><LaunchIcon sx={{color: 'background.paper'}} /></LoadingButton>
              </Box>
          </Card>
        </Zoom>

    )
}