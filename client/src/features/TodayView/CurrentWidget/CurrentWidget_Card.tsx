import { Card, Typography } from "@mui/material";
import { Board } from "app/models/board";
import CurrentWidgetTaskView from "./CurrentWidget_TaskView";

interface Props {
    boards: Board[]
}

export default function CurrentWidgetCard({boards}: Props) {

    const allInProgressTasks = boards.flatMap(b => b.sprints.flatMap(s => s.tasks.filter(t => t.currentState == 1)));

    return (
        <Card elevation={3} sx={{height: '95%', width: '95%', overflowY: 'auto'}}>
            <Typography variant="h2" sx={{margin: '10px 0px 5px 10px', color: 'grey.600'}}>In Progress Tasks</Typography>
            {allInProgressTasks.map((task, index) => (
                <CurrentWidgetTaskView 
                    task={task}
                    index={index}
                    max={allInProgressTasks.length - 1}
                    boardTitle={boards.find(b => b.sprints.flatMap(s => s.tasks.flatMap(t => t.taskEntityId == task.taskEntityId)))?.name || ""}
                    boardId={boards.find(b => b.sprints.flatMap(s => s.tasks.find(t => t.taskEntityId == task.taskEntityId) != undefined))?.boardEntityId || ""}
                    sprintId={boards.find(b => b.sprints.flatMap(s => s.tasks.find(t => t.taskEntityId == task.taskEntityId) != undefined))?.sprints.find(s => s.tasks.find(t => t.taskEntityId == task.taskEntityId) != undefined)?.sprintEntityId || ""}  />
            ))}
            <Typography textAlign={'center'} variant="subtitle2" sx={{fontSize: '12px', padding: '10px'}}>{"Current tasks: " + allInProgressTasks.length}</Typography>
        </Card>
    )
}