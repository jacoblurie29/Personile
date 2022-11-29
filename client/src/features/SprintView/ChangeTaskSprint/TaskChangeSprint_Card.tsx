import { LoadingButton } from "@mui/lab";
import {  Backdrop, Box, Button, Card, Dialog, Divider, Grid, Grow, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Task } from "app/models/task";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { formatDateStringNoYear } from "app/util/dateUtil";
import { Fragment, useEffect, useState } from "react";
import { changeTaskSprintAsync } from "app/state/userSlice";

interface Props {
    setMoveSprint: (value: boolean) => void,
    task: Task,
    oldSprintId: string
}

export default function TaskChangeSprintCard({setMoveSprint, task, oldSprintId}: Props) {

        // redux state
    const {currentBoard } = useAppSelector(state => state.sprintView);
    const userEntityId = useAppSelector(state => state.user.userData?.userEntityId);
    const dispatch = useAppDispatch();
    const sprints = useAppSelector(state => state.user.userData?.boards.find(b => b.boardEntityId == currentBoard)?.sprints);
    
    const [currentSprintButton, setCurrentSprintButton] = useState<string>(oldSprintId);
    
    const changeTaskSprint = (newSprintId: string) => {
        setMoveSprint(false);
        dispatch(changeTaskSprintAsync({userId: userEntityId || "", boardId: currentBoard || "", sprintId: oldSprintId, taskId: task.taskEntityId, newSprintId: newSprintId})).catch(error => console.log(error));
    }

    useEffect(() => {
        if(oldSprintId == "") setMoveSprint(false);
    }, [])
    

    

    return (

        <Backdrop
        sx={{ color: '#fff', overflow: 'scroll', overflowX: 'hidden', padding: '80px', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={true}
        >
            <Grow in={true}>
                <Card sx={{width: '50%', minWidth: '500px', maxWidth: '600px', margin: 'auto', textAlign: 'center'}}>
                    <>
                        <Typography variant="h2" paddingTop={'20px'}>
                            {"Change Task Sprint"}
                        </Typography>
                        <Divider sx={{paddingTop: '10px'}} />
                        <Box sx={{overflowY: 'auto', maxHeight: '400px'}}>
                        {[...sprints || []]?.sort((a,b) => Date.parse(a.startDate) - Date.parse(b.startDate)).map((sprint, index) => (
                            <Fragment key={index}>
                                <Grid container width={'100%'} columns={18}>
                                    <Grid item xs={6} padding={'0px 20px'}>
                                        <Typography variant="h3" paddingTop='25px' margin='auto' flexGrow={1}>
                                            {formatDateStringNoYear(sprint.startDate) + " - " + formatDateStringNoYear(sprint.endDate)}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={6} padding={'0px 20px'}>
                                        <Grid container width='fit-content' spacing={1} paddingTop='10px' margin='auto' flexGrow={1}>
                                            <Grid xs={4} item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <Box height='30px' width="30px" borderRadius='30px' sx={{backgroundColor: 'error.light'}}>
                                                    <Typography variant="h5" color='background.paper' textAlign='center' paddingTop='20%'>{sprint.tasks.filter(t => t.currentState === 0).length || "0"}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid xs={4} item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <Box height='30px' width="30px" borderRadius='30px' sx={{backgroundColor: 'warning.light'}} textAlign='center'>
                                                    <Typography variant="h5" color='background.paper' textAlign='center' paddingTop='20%'>{sprint.tasks.filter(t => t.currentState === 1).length || "0"}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid xs={4} item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                <Box height='30px' width="30px" borderRadius='30px' sx={{backgroundColor: 'success.light'}}>
                                                    <Typography variant="h5" color='background.paper' textAlign='center' paddingTop='20%'>{sprint.tasks.filter(t => t.currentState === 2).length || "0"}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item xs={6} padding={'15px 20px 0px 20px'}>
                                            <Grid container>
                                                <Grid item xs={10}>
                                                    <Button variant="contained" sx={{backgroundColor: "grey.400" }} onClick={() => setCurrentSprintButton(sprint.sprintEntityId)}>Select</Button>
                                                </Grid>
                                                <Grid item xs={2} sx={{textAlign: 'left', paddingTop: '5px'}}>
                                                    {currentSprintButton == sprint.sprintEntityId && currentSprintButton == oldSprintId && <CheckCircleIcon sx={{color:'grey.400'}} />}
                                                    {currentSprintButton == sprint.sprintEntityId && currentSprintButton != oldSprintId && <CheckCircleIcon sx={{color:'rgba(58,203,152,10)'}} />}
                                                </Grid>
                                            </Grid>
                                    </Grid>
                                </Grid>
                                <Divider sx={{paddingTop: '10px'}} />
                            </Fragment>
                        ))}
                        </Box>
                        <Box sx={{flexGrow: 1, textAlign: 'right', marginRight: '5px', marginTop: '5px', padding: '10px'}}>
                            <LoadingButton key={"cancel"} variant='contained' sx={{background: 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)', borderRadius:"5px", mr:"10px"}} onClick={() => setMoveSprint(false)}><ArrowBackIcon sx={{color: 'background.paper'}} /></LoadingButton>
                            <LoadingButton disabled={currentSprintButton == oldSprintId} type="submit" key={"next"} variant='contained' onClick={() => changeTaskSprint(currentSprintButton)} sx={{borderRadius:"5px", background: currentSprintButton == oldSprintId ? 'grey.400' : 'rgba(58,203,152,1)'}}><CheckCircleIcon sx={{color: 'background.paper'}}/></LoadingButton>
                        </Box>
                    </>
                </Card>
                </Grow>
        </Backdrop>

    )
}