import { Backdrop, Grow, Card, Typography, Grid, Divider, Button } from "@mui/material";
import { Board } from "app/models/board";
import { useAppDispatch } from "app/store/configureStore";
import TodayWidgetTaskView from "./TodayWidget_TaskView";

interface Props {
    boards: Board[],
    handleOpenDialog: (value: boolean) => void
}

export default function TodayWidgetAddTasksDialog({boards, handleOpenDialog}: Props) {

    const allTasks = boards.flatMap(b => b.sprints.flatMap(s => s.tasks));

    return (
        <Backdrop
        sx={{ color: '#fff', overflow: 'scroll', overflowX: 'hidden', padding: '80px', zIndex: (theme) => theme.zIndex.drawer + 1}}
        open={true}
        >
            <Grow in={true}>
                <Card sx={{width: '650%', minWidth: '500px', maxWidth: '600px', margin: 'auto', textAlign: 'center'}}>
                    <>
                        <Typography variant="h3" paddingTop={'20px'}>
                            {"What tasks do you want to complete today?"}
                        </Typography>
                        <Divider sx={{margin: '5px 5px 0px 5px'}} />
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography textAlign={'center'} variant="h4" sx={{fontSize: '16px', padding: '10px 5px 5px 5px'}}>{"All tasks"}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography textAlign={'center'} variant="h4" sx={{fontSize: '16px', padding: '10px 5px 5px 5px'}}>{"Today's focused tasks"}</Typography>
                            </Grid>
                        </Grid>
                        <Divider sx={{margin: '5px 5px 5px 5px'}} />
                        <Grid container>
                            <Grid item xs={6} borderRight={1} borderColor={'grey.200'} sx={{overflowY: 'auto', maxHeight: '300px'}}>
                                {allTasks.filter((task) => task.focused != true).map((task, index) => (
                                    <TodayWidgetTaskView task={task} index={index} max={allTasks.filter((task) => task.focused != true).length - 1} boardTitle={boards.find(b => b.sprints.flatMap(s => s.tasks.flatMap(t => t.taskEntityId == task.taskEntityId)))?.name || ""} isLeftSide={true} boards={boards} />
                                ))}
                            </Grid>
                            <Grid item xs={6} sx={{overflowY: 'auto', maxHeight: '300px'}}>
                                {allTasks.filter((task) => task.focused == true).map((task, index) => (
                                    <TodayWidgetTaskView task={task} index={index} max={allTasks.filter((task) => task.focused == true).length - 1} boardTitle={boards.find(b => b.sprints.flatMap(s => s.tasks.flatMap(t => t.taskEntityId == task.taskEntityId)))?.name || ""} isLeftSide={false} boards={boards} />
                                ))}
                            </Grid>
                        </Grid>
                        <Grid container sx={{backgroundColor: 'rgba(0,0,0,0.05)'}}>
                            <Grid item xs={6}>
                                {allTasks.filter((task) => task.focused != true).length > 4 && 
                                    <Typography textAlign={'center'} variant="subtitle2" sx={{margin: '5px'}}>{"Scroll for more"}</Typography>
                                }
                            </Grid>
                            <Grid item xs={6}>
                                {allTasks.filter((task) => task.focused == true).length > 4 && 
                                    <Typography textAlign={'center'} variant="subtitle2"  sx={{margin: '5px'}}>{"Scroll for more"}</Typography>
                                }                  
                            </Grid>
                        </Grid>
                        <Divider />
                        <Button variant="contained" sx={{margin: '10px', display: 'flex', marginLeft: 'auto'}} onClick={() => handleOpenDialog(false)}>Done</Button>
                    </>
                </Card>
            </Grow>
        </Backdrop>
    )
}