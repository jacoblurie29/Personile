import { ActivityEvent } from "./activityEvent";
import { Goal } from "./goal";
import { Milestone } from "./milestone";
import { Sprint } from "./sprint";

export interface UpdateBoard {
  boardEntityId: string;
  name: string;
  description: string;
  goals: Goal[];
  milestones: Milestone[];
  activityEvents: ActivityEvent[];
}
