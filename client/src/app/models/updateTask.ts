import { SubTask } from "./subTask";
import { Task } from "./task";

export interface UpdateTask {
  taskEntityId: string;
  name: string;
  description: string;
  links: string;
  dateCreated: string;
  dateFinished: string;
  dueDate: string;
  currentState: number;
  tags: string;
  effort: number;
  color: number;
  order: number;
  focused: boolean;
}

export function mapTaskToUpdateTask(task: Task) {
  return {
    taskEntityId: task.taskEntityId,
    name: task.name,
    description: task.description,
    links: task.links,
    dateCreated: task.dateCreated,
    dateFinished: task.dateFinished,
    dueDate: task.dueDate,
    currentState: task.currentState,
    tags: task.tags,
    effort: task.effort,
    color: task.color,
    order: task.order,
    focused: task.focused,
  };
}

export function mapUpdateTaskToTask(task: UpdateTask) {
  const emptySubtaskArr = [] as SubTask[];

  return {
    taskEntityId: task.taskEntityId,
    name: task.name,
    description: task.description,
    links: task.links,
    dateCreated: task.dateCreated,
    dateFinished: task.dateFinished,
    dueDate: task.dueDate,
    currentState: task.currentState,
    tags: task.tags,
    effort: task.effort,
    color: task.color,
    order: task.order,
    focused: task.focused,
    milestoneIds: "",
    subTasks: emptySubtaskArr,
  };
}
