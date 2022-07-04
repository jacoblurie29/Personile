import { Task } from "./task";

export interface Sprint {
    sprintEntityId: string;
    userId: string;
    startDate: Date;
    endDate: Date;
    tasks: Task[];
}