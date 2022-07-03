import { Dialog, DialogTitle, DialogContent, DialogContentText, Divider, Grid, Typography, DialogActions, Button, Backdrop, Chip, LinearProgress, linearProgressClasses, styled, Tooltip } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Task } from "../../app/models/task";
import SubTasksView from "./SubTasksView";
import TaskStateDialogDisplay from "./TaskStateDialogDisplay";

interface Props {
    open: boolean,
    focusedTask: Task,
    handleClose: () => void
}

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

export default function TaskDialog({open, focusedTask, handleClose}: Props) {


    return (
        <>
            {open &&
            <Backdrop
                    sx={{ color: '#FAFAFA', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                >
                <Dialog open={open} onClose={handleClose} maxWidth='xs'>
                    <DialogTitle>
                        <Grid container>
                            <Grid item xs={8}>
                                {focusedTask?.name}
                            </Grid>
                            <Grid item xs={4} paddingTop='5px'>
                                <TaskStateDialogDisplay currentState={focusedTask.currentState}/>
                            </Grid>
                        </Grid>
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {focusedTask?.description}
                        </DialogContentText>
                        <Divider sx={{paddingTop: '5px', paddingBottom: '5px'}}/>
                        <Typography variant="caption">Tags</Typography>
                        <Grid container padding='10px' display='flex' alignItems="center" justifyContent="center" border='1px solid #ECECEC' sx={{borderRadius: '5px', mb: '5px'}}>
                            <Grid item xs={12} justifyContent='center' display='flex'>
                            {focusedTask?.tags.split('|').map((tag, index) => (
                                <Chip key={tag} label={tag} sx={{margin: '5px'}} />
                            ))}
                            </Grid>
                        </Grid>
                        <Typography variant="caption">Estimated effort</Typography>
                        <Tooltip title={focusedTask.effort} arrow>
                        <BorderLinearProgress sx={{mt: '2px', mb: '12px'}} variant="determinate" value={focusedTask.effort * 10} />
                        </Tooltip>
                        <Typography variant="caption">Subtasks&nbsp;({focusedTask.subTasks.length})</Typography>
                        {focusedTask.subTasks.length > 0 && <SubTasksView task={focusedTask} isDialog={true} />}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Edit</Button>
                        <Button onClick={handleClose}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Backdrop>
            }
        </>
    )
}

/*
<Grid container paddingTop='10px' display='flex'>
    <Grid item xs={6}>
        {focusedTask?.dueDate &&
            <Typography variant="body1" sx={{flexGrow: 1, textAlign: 'right', verticalAlign: "middle", mr: '20px'}}>
                Due date:&nbsp;
                { 
                new Date(focusedTask?.dueDate).toLocaleDateString()
                }
            </Typography>                                
        }
    </Grid>
</Grid>
*/