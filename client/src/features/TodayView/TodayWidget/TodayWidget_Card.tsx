import { Box, Card, IconButton, Typography, useTheme } from "@mui/material";
import { Board } from "app/models/board";
import EditIcon from '@mui/icons-material/Edit';
import { useState } from "react";
import TodayWidgetAddTasksDialog from "./TodayWidget_AddTasksDialog";
import TodayWidgetCardTaskView from "./TodayWidget_CardTaskView";

interface Props {
    boards: Board[]
}

export default function TodayWidgetCard({boards}: Props) {

    const theme = useTheme();

    const allFocusedTasks = boards.flatMap(b => b.sprints.flatMap(s => s.tasks.filter(t => t.focused == true)));

    const [openDialog, setOpenDialog] = useState<boolean>(false);

    // styles
    const iconButtonStyles = {
        boxShadow: '0.05rem 0.05rem 0.05rem 0.05rem rgba(100,100,100, 0.1)',
        height: 'fit-content',
        marginTop: 'auto',
        marginBottom: 'auto',
        backgroundColor: 'primary.main',
        '&:hover': {
            boxShadow: '0.02rem 0.02rem 0.02rem 0.02rem rgba(100,100,100, 0.2)',
            backgroundColor: 'primary.dark',
        }
    }


    return (
        <Card elevation={0} sx={{height: '95%', width: '95%', borderRadius: '25px', border: '1px solid', borderColor: 'grey.400', padding: '20px'}}>
            <>
                <Typography variant="h2" sx={{margin: '10px 0px 5px 10px', color: 'grey.600'}}>Today's Tasks</Typography>
                <Box sx={{ overflowY: 'auto', maxHeight: '75%' }}>
                    {allFocusedTasks.map((task, index) => (
                    <TodayWidgetCardTaskView 
                        task={task}
                        index={index}
                        max={allFocusedTasks.length - 1}
                        boardTitle={boards.find(b => b.sprints.find(s => s.tasks.find(t => t.taskEntityId == task.taskEntityId) !== undefined) !== undefined)?.name || ""}
                        boardId={boards.find(b => b.sprints.find(s => s.tasks.find(t => t.taskEntityId == task.taskEntityId) != undefined) !== undefined)?.boardEntityId || ""}
                        sprintId={boards.find(b => b.sprints.find(s => s.tasks.find(t => t.taskEntityId == task.taskEntityId) != undefined) !== undefined)?.sprints.find(s => s.tasks.find(t => t.taskEntityId == task.taskEntityId) != undefined)?.sprintEntityId || ""}  />
                    ))}
                </Box>
                <Box margin={'8px auto'} display={'flex'} justifyContent={'center'}>
                    <IconButton 
                        sx={iconButtonStyles}
                        onClick={() => {setOpenDialog(true)}}>
                        <EditIcon sx={{color: 'grey.50', fontSize: '12px'}} />
                    </IconButton>
                </Box>
                {openDialog && <TodayWidgetAddTasksDialog boards={boards} handleOpenDialog={setOpenDialog} />}
            </>
        </Card>
    )
}