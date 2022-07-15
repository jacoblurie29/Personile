import { Sprint } from "./sprint";

export interface Board {
    boardEntityId: string;
    startDate: string;
    endDate: string;
    sprints: Sprint[];
}