import { Grid, Typography, Chip, LinearProgress, linearProgressClasses, styled, Tooltip, Box, ListItem } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import { Task } from "app/models/task";
import TaskMilestonesSubView from "../ViewTask/ViewTask_MilestonesSubView";
import ViewTaskSubtaskSubView from "../ViewTask/ViewTask_SubtaskSubView";

interface Props {
    focusedTask: Task,
}

// effort slider styles
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundImage: 'linear-gradient(to right, #0fe21f, #6ee11a, #99e023, #bade34, #d4dd47, #e4d346, #f1c84a, #fbbe51, #ffa74c, #ff8f4e, #ff7755, #fb5f5f)',
    },
}));

export default function SummaryTaskMoreDetails({ focusedTask }: Props) {

    // redux state
    const { currentBoard } = useAppSelector(state => state.sprintView);
    const boards = useAppSelector(state => state.user.userData?.boards);
    const board = boards?.find(b => b.boardEntityId == currentBoard)

    return (
        <Box paddingBottom='10px'>
            <Grid container spacing={2}>

                <Grid item xs={6}>
                    <Typography variant="caption" sx={{color: 'grey.600'}}>Tags&nbsp;({focusedTask.tags !== '' ? focusedTask.tags.split("|").length : 0})</Typography>
                    {focusedTask.tags !== '' ? 
                        <Grid container padding='10px' display='flex' alignItems="center" justifyContent="center" border='1px solid #ECECEC' sx={{borderRadius: '5px', mb: '5px'}}>
                    
                            <Grid item justifyContent='center' sx={{margin: 'auto'}}>
                            {focusedTask?.tags.split('|').map((tag, index) => (
                                <Chip size={'small'} key={tag} label={tag} sx={{margin: '2px', padding: '0px', backgroundColor: 'primary.light', fontSize: '11px'}} />
                            ))}
                            </Grid>
                        </Grid>
                    :
                    <ListItem sx={{backgroundColor: 'grey.50', borderRadius: "5px"}}>
                        <Box sx={{ marginRight: '5px', textAlign:'center'}} flexGrow={1} >
                            <Typography variant="subtitle2" fontSize={"14px"}>No tags for this task.</Typography>
                        </Box>
                    </ListItem>
                    }
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="caption" sx={{color: 'grey.600'}}>Links&nbsp;({focusedTask.links !== '' ? focusedTask.links.split("|").length : 0})</Typography>
                    {focusedTask.links !== '' ? 
                        <Box sx={{paddingBottom: '5px'}}>
                            <Grid container padding='10px' display='flex' alignItems="center" justifyContent="center" border='1px solid #ECECEC' sx={{borderRadius: '5px', mb: '5px'}}>
                                <Grid item justifyContent='center' sx={{margin: 'auto'}}>
                                {focusedTask?.links.split('|').map((tag, index) => (
                                    <Chip size={'small'} key={tag} label={tag} onClick={()=> window.open(tag, "_blank")} sx={{margin: '2px', padding: '0px', backgroundColor: 'primary.light', fontSize: '11px'}} />
                                ))}
                                </Grid>
                            </Grid>
                        </Box>
                        :
                        <ListItem sx={{backgroundColor: 'grey.50', borderRadius: "5px"}}>
                            <Box sx={{ marginRight: '5px', textAlign:'center'}} flexGrow={1} >
                                <Typography variant="subtitle2" fontSize={"14px"}>No links for this task.</Typography>
                            </Box>
                        </ListItem>
                    }
                </Grid>

            </Grid>

            <Grid container spacing={2}>

                <Grid item xs={6}>
                    <Typography variant="caption" sx={{color: 'grey.600'}}>Milestones&nbsp;({focusedTask.milestoneIds === "" ? "0" : focusedTask.milestoneIds.split("|").length})</Typography>
                    <TaskMilestonesSubView task={focusedTask} />
                </Grid>

                <Grid item xs={6}>
                    <Typography variant="caption" sx={{color: 'grey.600'}}>Subtasks&nbsp;({focusedTask.subTasks.length})</Typography>
                    <ViewTaskSubtaskSubView task={focusedTask} isDialog={true} />     
                </Grid>

            </Grid>

            <Typography variant="caption" sx={{color: 'grey.600'}}>Estimated effort</Typography>
            <Tooltip title={focusedTask.effort} arrow>
                <BorderLinearProgress sx={{mt: '2px', mb: '12px', boxShadow: '1px 2px 7px #777777' }} variant="determinate" value={focusedTask.effort * 10} />
            </Tooltip>    
        </Box>
    )
}