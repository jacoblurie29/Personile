import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { UpdateTask } from "app/models/updateTask";
import { toast } from "react-toastify";
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
            return await agent.UserData.addTask(userId, sprintId, task);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const removeTaskFromSprintAsync = createAsyncThunk<void, {userId: string, sprintId: string, taskId: string}>(
    'sprint/removeTaskFromSprintAsync',
    async ({userId, sprintId, taskId}, thunkAPI) => {
        try {
            return await agent.UserData.removeTask(userId, sprintId, taskId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const updateTaskStateAsync = createAsyncThunk<Task, {userId: string, sprintId: string, taskId: string, updatedTaskDto: UpdateTask, updatedTask: Task, previousState: number}>(
    'sprint/updateTaskState',
    async ({userId, sprintId, taskId, updatedTask}, thunkAPI) => {
        try {
            return await agent.UserData.updateTaskState(userId, sprintId, taskId, updatedTask);
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

            if (currentSprintIndex === undefined || currentSprintIndex === -1) return;

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

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            if(state.userData === null || state.userData === undefined) return;

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

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            if(state.userData === null || state.userData === undefined) return;

            const taskIndex = state.userData?.sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            state.userData?.sprints[sprintIndex].tasks.splice(taskIndex, 1);

            state.status = 'idle';
        });
        builder.addCase(removeTaskFromSprintAsync.rejected, (state, action) => {
            state.status = 'idle';
        });
        builder.addCase(updateTaskStateAsync.pending, (state, action) => {
            const {sprintId, taskId} = action.meta.arg;

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            if(state.userData === null || state.userData === undefined) return;

            const taskIndex = state.userData?.sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            state.userData?.sprints[sprintIndex].tasks.splice(taskIndex, 1, action.meta.arg.updatedTask);

            state.status = 'pendingUpdateTask';

            
        });
        builder.addCase(updateTaskStateAsync.fulfilled, (state, action) => {

            state.status = 'idle';

            toast.success('Task updated!', {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light'
                });

        });
        builder.addCase(updateTaskStateAsync.rejected, (state, action) => {
            const {sprintId, taskId} = action.meta.arg;

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            if(state.userData === null || state.userData === undefined) return;

            const taskIndex = state.userData?.sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            var revertedTask = action.meta.arg.updatedTask;
            revertedTask.currentState = action.meta.arg.previousState;

            state.userData?.sprints[sprintIndex].tasks.splice(taskIndex, 1, revertedTask);

            toast.error("Failed to update task state!");

            state.status = 'idle';
        });
    })
})

export const {setUser, removeTask, setLoading} = userSlice.actions;