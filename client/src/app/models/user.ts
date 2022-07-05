import { Sprint } from "./sprint";

export interface User {
    userEntityId: string;
    firstName: string;
    lastName: string;
    email: string;
    sprints: Sprint[];
}