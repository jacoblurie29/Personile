import { createSlice } from "@reduxjs/toolkit";
import { User } from "../models/user";

interface UserState {
    userData: User | null;
    loading: boolean | null;
}

const initialState : UserState = {
    userData: null,
    loading: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.userData = action.payload
        },
        removeTask: (state, action) => {
            const {taskId, sprintId} = action.payload;
            
            const currentSprintIndex = state.userData?.sprints.findIndex(sprint => sprint.sprintEntityId === sprintId);

            if (currentSprintIndex == undefined || currentSprintIndex === -1) return;

            const currentTaskIndex = state.userData?.sprints[currentSprintIndex].tasks.findIndex(task => task.id === taskId)

            if(currentTaskIndex === -1 || currentTaskIndex === undefined) return;

            state.userData?.sprints[currentSprintIndex].tasks.splice(currentTaskIndex, 1);

        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    }
})

export const {setUser, removeTask, setLoading} = userSlice.actions;