import { Task } from "app/models/task";

// Return true if equal
export function compareTasks(task1: Task, task2: Task) {

     return task1.name == task2.name &&
            task1.description == task2.description &&
            task1.links == task2.links &&
            task1.tags == task2.tags &&
            task1.dueDate == task2.dueDate && 
            task1.effort == task2.effort &&
            task1.color == task2.color;
}

// Return true if equal
export function compareTaskMilestones(task1: Task, task2: Task) {
    return task1.milestoneIds == task2.milestoneIds;
}