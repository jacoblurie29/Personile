import { Card, Typography } from "@mui/material";
import { Board } from "app/models/board";
import { Milestone } from "app/models/milestone";
import { Task } from "app/models/task";
import { convertDateToMilliseconds } from "app/util/dateUtil";
import UpcomingWidgetMilestoneView from "./UpcomingWidget_MilestoneView";
import UpcomingWidgetTaskView from "./UpcomingWidget_TaskView";

interface Props {
    boards: Board[]
}

export default function UpcomingWidgetCard({boards}: Props) {

    const UPCOMING_RANGE = 14 * 86400000;

    const allUpcomingTasks = boards.flatMap(b => b.sprints.flatMap(s => s.tasks.filter(t => t.dueDate !== "")))
                                .filter(t => {
                                    return convertDateToMilliseconds(t.dueDate) - convertDateToMilliseconds(new Date().toDateString()) < UPCOMING_RANGE;
                                });

    const allUpcomingMilestones = boards.flatMap(b => b.milestones
                                .filter(m => {
                                    return convertDateToMilliseconds(m.dueDate) - convertDateToMilliseconds(new Date().toDateString()) < UPCOMING_RANGE;
                                }))

    
    
    const allTasksAndMilestones = () => {

        var all = new Array<Task | Milestone>();
        var allTasksCopy = [...allUpcomingTasks].sort((a, b) => convertDateToMilliseconds(a.dueDate) - convertDateToMilliseconds(b.dueDate));
        var allMilestonesCopy = [...allUpcomingMilestones].sort((a, b) => convertDateToMilliseconds(a.dueDate) - convertDateToMilliseconds(b.dueDate));



        while(allTasksCopy.length !== 0 || allMilestonesCopy.length !== 0) {

            if(allTasksCopy.length == 0) {
                all = all.concat(allMilestonesCopy);
                break;
            }

            if(allMilestonesCopy.length == 0) {
                all = all.concat(allTasksCopy);
                break;
            }

            if(convertDateToMilliseconds(allTasksCopy[allTasksCopy.length - 1]?.dueDate!) < convertDateToMilliseconds(allMilestonesCopy[allMilestonesCopy.length - 1]?.dueDate!)) {
                all.push(allTasksCopy.pop()!);
            } else {
                all.push(allMilestonesCopy.pop()!);
            }
        }
        return all;

    }


    function isTask(object: any): object is Task {
        return 'taskEntityId' in object;
    }


    return (
        <Card elevation={3} sx={{height: '95%', width: '95%', overflowY: 'auto'}}>
            <Typography variant="h2" sx={{margin: '10px 0px 5px 10px', color: 'grey.600'}}>{"Upcoming Items"}</Typography>
            {allTasksAndMilestones().map((object, index) => (
                isTask(object) ? 
                <UpcomingWidgetTaskView 
                    task={object}
                    index={index}
                    max={allTasksAndMilestones().length - 1}
                    boardTitle={boards.find(b => b.sprints.flatMap(s => s.tasks.flatMap(t => t.taskEntityId == object.taskEntityId)))?.name || ""}
                    boardId={boards.find(b => b.sprints.flatMap(s => s.tasks.find(t => t.taskEntityId == object.taskEntityId) != undefined))?.boardEntityId || ""}
                    sprintId={boards.find(b => b.sprints.flatMap(s => s.tasks.find(t => t.taskEntityId == object.taskEntityId) != undefined))?.sprints.find(s => s.tasks.find(t => t.taskEntityId == object.taskEntityId) != undefined)?.sprintEntityId || ""} />
                :
                <UpcomingWidgetMilestoneView
                    milestone={object}
                    index={index}
                    max={allTasksAndMilestones().length - 1}
                    boardTitle={boards.find(b => b.milestones.flatMap(m => m.milestoneEntityId == object.milestoneEntityId))?.name || ""}
                    boardId={boards.find(b => b.milestones.flatMap(m => m.milestoneEntityId == object.milestoneEntityId))?.boardEntityId || ""}
                    sprintId={boards.find(b => b.milestones.flatMap(m => m.milestoneEntityId == object.milestoneEntityId))?.sprints[0].sprintEntityId || ""}
                 />

            ))}
            <Typography textAlign={'center'} variant="subtitle2" sx={{fontSize: '12px', padding: '10px'}}>{"Tasks: " + allUpcomingTasks.length + ", Milestones: " + allUpcomingMilestones.length}</Typography>

        </Card>

    )
}