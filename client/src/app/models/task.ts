export interface Task {
    id: string;
    userId: string;
    sprintId: string;
    groupId: string;
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