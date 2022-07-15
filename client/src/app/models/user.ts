import { Board } from "./board";

export interface User {
    userEntityId: string;
    token: string;
    firstName: string;
    lastName: string;
    email: string;
    boards: Board[];
}