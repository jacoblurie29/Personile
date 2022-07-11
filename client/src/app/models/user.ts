import { Sprint } from "./sprint";

export interface User {
    userEntityId: string;
    token: string;
    firstName: string;
    lastName: string;
    email: string;
    sprints: Sprint[];
}