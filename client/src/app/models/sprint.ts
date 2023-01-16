import { Task } from "./task";

export interface Sprint {
  sprintEntityId: string;
  userId: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
}
