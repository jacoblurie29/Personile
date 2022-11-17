import { ActivityEvent } from "./activityEvent";
import { Goal } from "./goal";
import { Milestone } from "./milestone";
import { Sprint } from "./sprint";

export interface Board {
    boardEntityId: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    sprintDaysLength: number;
    handleOverflow: string;
    sprints: Sprint[];
    goals: Goal[];
    milestones: Milestone[];
    activityEvents: ActivityEvent[];
}