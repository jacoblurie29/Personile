import { SubTask } from "./subTask";

export interface Task {
    taskEntityId: string;
    name: string;
    description: string;
    links: string;
    dateCreated: string;
    dateFinished:string;
    dueDate: string;
    currentState: number;
    tags: string;
    effort: number;
    color: number;
    subTasks: SubTask[];
    order: number;
    milestoneIds: string;
    focused: boolean;
}