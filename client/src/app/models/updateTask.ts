import { Task } from "./task";

export interface UpdateTask {
    taskEntityId: string;
    userId: string;
    name: string;
    description: string;
    links: string;
    dateCreated: Date;
    dateFinished: Date;
    dueDate: Date;
    currentState: number;
    tags: string;
    effort: number;
    color: number;
}

export function mapTaskToUpdateTask(task: Task) {
    return {
        taskEntityId: task.taskEntityId,
        userId: task.userId,
        name: task.name,
        description: task.description,
        links: task.links,
        dateCreated: task.dateCreated,
        dateFinished: task.dateFinished,
        dueDate: task.dueDate,
        currentState: task.currentState,
        tags: task.tags,
        effort: task.effort,
        color: task.color
    } 
}