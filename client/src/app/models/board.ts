import { Goal } from "./goal";
import { Milestone } from "./milestone";
import { Sprint } from "./sprint";

export interface Board {
    boardEntityId: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    sprints: Sprint[];
    goals: Goal[];
    milestones: Milestone[];
}