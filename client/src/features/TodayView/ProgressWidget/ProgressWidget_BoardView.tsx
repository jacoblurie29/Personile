import { Card, Grid, Box, Typography, IconButton, CircularProgress, CircularProgressProps } from "@mui/material";
import { Board } from "app/models/board";
import { useAppDispatch } from "app/store/configureStore";
import { setCurrentSprint, setCurrentBoard } from "features/SprintView/Redux/sprintSlice";
import { useHistory } from "react-router-dom";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface Props {
    board: Board,
    index: number,
    max: number
}

export default function ProgressWidgetBoardView({board, index, max}: Props) {

    const dispatch = useAppDispatch();
    const history = useHistory();


    // invert colors on state selected
    const boxStyles = {
        backgroundColor: 'grey.400',
        borderRadius: '8px',
        padding: '7px'
    }

    function CircularProgressWithLabel(
        props: CircularProgressProps & { value: number },
      ) {
        return (
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} sx={{color: props.value < 40 ? "error.main" : props.value < 70 ? "warning.main" : "success.main"}}/>
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                component="div"
                color={"grey.600"}
              >{`${Math.round(props.value)}%`}</Typography>
            </Box>
          </Box>
        );
      }

    const calculateBorderRadius = (index: number) => {
        if(index == 0 && max == 0) {
            return '5px';
        } else if(index == 0) {
            return '5px 5px 0px 0px';
        } else if (index == max) {
            return '0px 0px 5px 5px';
        } else {
            return '0px';
        }
    } 

    const handleOpenBoard = (boardId: string) => {
        if(boardId == "" || board == undefined) return;

        dispatch(setCurrentSprint(board.sprints[0].sprintEntityId));
        dispatch(setCurrentBoard(boardId));

        history.push('/sprint');

    }

    const calculatePercentComplete = () => {

        if(board.sprints.flatMap(sprint => sprint.tasks).length == 0) {
            return 0;
        } 

        return Math.round((board.sprints.flatMap(sprint => sprint.tasks).filter((task) => task.currentState == 2).length / board.sprints.flatMap(sprint => sprint.tasks).length) * 100);
    }

    return (
        <Card elevation={1} sx={{width: '92%', border: '0.01px solid', borderColor: 'grey.400', margin: '0px 10px', borderRadius: calculateBorderRadius(index)}}>
             <Grid container display='flex' flexGrow={1} sx={{padding: '15px 5px'}} >
                <Grid item xs={1}
                        display="flex" 
                        alignItems="center"
                        justifyContent="flex-middle" >
                    <Box sx={boxStyles}
                    display="flex" alignItems="center" flexDirection="column">
                        <Typography sx={{fontSize: '25px', color: 'grey.50'}} >&nbsp;B&nbsp;</Typography>
                    </Box>
                </Grid>
                <Grid item padding='0px 5px' xs={7} alignItems="center" textAlign={'left'}>
                    <Typography variant="body1" sx={{margin: '0px 15px', fontSize: '15px'}}>&nbsp;{board.name}</Typography> 
                    <Grid container width='fit-content' sx={{margin: '0px 15px'}}>
                        <Grid xs={4} item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px 2px'}}>
                            <Box height='26px' width="26px" borderRadius='30px' sx={{backgroundColor: 'error.light'}}>
                                <Typography variant="h5" color='background.paper' textAlign='center' paddingTop='17%'>{board.sprints?.flatMap(s => s.tasks).filter(t => t.currentState === 0).length || "0"}</Typography>
                            </Box>
                        </Grid>
                        <Grid xs={4} item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px 2px'}}>
                            <Box height='26px' width="26px" borderRadius='30px' sx={{backgroundColor: 'warning.light'}} textAlign='center'>
                                <Typography variant="h5" color='background.paper' textAlign='center' paddingTop='17%'>{board.sprints?.flatMap(s => s.tasks).filter(t => t.currentState === 1).length || "0"}</Typography>
                            </Box>
                        </Grid>
                        <Grid xs={4} item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0px 2px'}}>
                            <Box height='26px' width="26px" borderRadius='30px' sx={{backgroundColor: 'success.light'}}>
                                <Typography variant="h5" color='background.paper' textAlign='center' paddingTop='17%'>{board.sprints?.flatMap(s => s.tasks).filter(t => t.currentState === 2).length || "0"}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={2}
                        display="flex" 
                        alignItems="center"
                        justifyContent="flex-middle">
                    <CircularProgressWithLabel value={calculatePercentComplete()} />
                </Grid>
                <Grid item xs={2}
                        display="flex" 
                        alignItems="center"
                        justifyContent="flex-end"
                        paddingRight='10px' >
                    <IconButton sx={{backgroundColor: 'grey.400',
                            width: 'fit-content',
                            borderRadius: '8px',
                            padding: '6px',
                            alignItems: "center",
                            flexDirection: "column",
                            ":hover": {
                                backgroundColor: 'grey.500'
                            }}}
                            onClick={() => handleOpenBoard(board.boardEntityId)}
                            >
                        <OpenInNewIcon sx={{fontSize: '22px', color: 'grey.50'}} />
                    </IconButton>
                </Grid>
            </Grid>

        </Card>
    )
}