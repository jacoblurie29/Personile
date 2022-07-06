import { SubTask } from "./subTask";

export interface Task {
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
    subTasks: SubTask[];
}