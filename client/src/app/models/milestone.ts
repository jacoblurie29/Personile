export interface Milestone {
    milestoneEntityId: string;
    description: string;
    status: string;
    dueDate: string;
    hardDeadline: boolean;
    associatedTaskIds: string;
    completedDate: string;
}