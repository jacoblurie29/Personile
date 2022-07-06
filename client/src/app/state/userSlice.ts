import { useRadioGroup } from "@mui/material";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../api/agent";
import { Sprint } from "../models/sprint";
import { Task } from "../models/task";
import { User } from "../models/user";

interface UserState {
    userData: User | null;
    loading: boolean | null;
    status: string;
}

const initialState : UserState = {
    userData: null,
    loading: false,
    status: "idle"
}


export const addTaskToSprintAsync = createAsyncThunk<Sprint, {userId: string, sprintId: string, task: Task}>(
    'sprint/addTaskToSprintAsync',
    async ({userId, sprintId, task}, thunkAPI) => {
        try {
            return await agent.Sprints.addTask(userId, sprintId, task);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const removeTaskFromSprintAsync = createAsyncThunk<void, {userId: string, sprintId: string, taskId: string}>(
    'sprint/removeTaskFromSprintAsync',
    async ({userId, sprintId, taskId}, thunkAPI) => {
        try {
            return await agent.Sprints.removeTask(userId, sprintId, taskId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)


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

            const currentTaskIndex = state.userData?.sprints[currentSprintIndex].tasks.findIndex(task => task.taskEntityId === taskId)

            if(currentTaskIndex === -1 || currentTaskIndex === undefined) return;

            state.userData?.sprints[currentSprintIndex].tasks.splice(currentTaskIndex, 1);

        },
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    },
    extraReducers: (builder => {
        builder.addCase(addTaskToSprintAsync.pending, (state, action) => {
            state.status = 'pendingAddTask';
        });
        builder.addCase(addTaskToSprintAsync.fulfilled, (state, action) => {

            const { sprintId } = action.meta.arg;

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId == sprintId);

            if (sprintIndex == undefined || sprintIndex < 0) return;

            if(state.userData == null || state.userData == undefined) return;

            state.userData?.sprints.splice(sprintIndex, 1, action.payload);

            state.status = 'idle';
        });
        builder.addCase(addTaskToSprintAsync.rejected, (state, action) => {
            state.status = 'idle';
        });
        builder.addCase(removeTaskFromSprintAsync.pending, (state, action) => {
            state.status = 'pendingRemoveTask';
        });
        builder.addCase(removeTaskFromSprintAsync.fulfilled, (state, action) => {
            const {sprintId, taskId} = action.meta.arg;

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId == sprintId);

            if (sprintIndex == undefined || sprintIndex < 0) return;

            if(state.userData == null || state.userData == undefined) return;

            const taskIndex = state.userData?.sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId == taskId);

            state.userData?.sprints[sprintIndex].tasks.splice(taskIndex, 1);

            state.status = 'idle';
        });
        builder.addCase(removeTaskFromSprintAsync.rejected, (state, action) => {
            state.status = 'idle';
        })
    })
})

export const {setUser, removeTask, setLoading} = userSlice.actions;