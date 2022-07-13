import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import { UpdateTask } from "app/models/updateTask";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { Sprint } from "../models/sprint";
import { Task } from "../models/task";
import { User } from "../models/user";
import { mapUpdateTaskToTask } from "app/models/updateTask";
import { SubTask } from "app/models/subTask";
import { FieldValues } from "react-hook-form";
import { history } from "../..";
import { store } from "app/store/configureStore";
import { setCurrentSprint } from "features/SprintView/sprintSlice";

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




export const addTaskToSprintAsync = createAsyncThunk<Sprint, {userId: string, sprintId: string, task: UpdateTask}>(
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

export const updateTaskAsync = createAsyncThunk<Task, {userId: string, sprintId: string, taskId: string, updatedTaskDto: UpdateTask, previousState: Task, futureState: Task}>(
    'sprint/updateTask',
    async ({userId, sprintId, taskId, updatedTaskDto}, thunkAPI) => {
        try {
            return await agent.UserData.updateTaskState(userId, sprintId, taskId, updatedTaskDto);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const addSubTaskToTaskAsync = createAsyncThunk<SubTask, {userId: string, sprintId: string, taskId: string, newSubtask: SubTask}>(
    'sprint/addSubtaskToTask',
    async ({userId, sprintId, taskId, newSubtask}, thunkAPI) => {
        try {
            return await agent.UserData.addSubtask(userId, sprintId, taskId, newSubtask)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
) 

export const updateSubtaskStateAsync = createAsyncThunk<SubTask, {userId: string, sprintId: string, taskId: string, subtaskId: string, updatedSubtask: SubTask}>(
    'sprints/updateSubtaskState',
    async ({userId, sprintId, taskId, subtaskId, updatedSubtask}, thunkAPI) => {
        try {
            return await agent.UserData.updateSubtask(userId, sprintId, taskId, subtaskId, updatedSubtask)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const signInUser = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data, thunkAPI) => {
        try {
            const userDto = await agent.Account.login(data);
            if (userDto) thunkAPI.dispatch(setUser(userDto));
            localStorage.setItem('user', JSON.stringify(userDto));

            store.dispatch(setCurrentSprint(userDto.sprints[0].sprintEntityId));
            return userDto;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const fetchCurrentUser = createAsyncThunk<User>(
    'account/fetchCurrenUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)))
        try {
            const userDto = await agent.Account.currentUser();
            if (userDto) thunkAPI.dispatch(setUser(userDto));
            localStorage.setItem('user', JSON.stringify(userDto));
            
            store.dispatch(setCurrentSprint(userDto.sprints[0].sprintEntityId));
        

            return userDto;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }, {
        condition: () => {
            if (!localStorage.getItem('user')) {
                return false;
            }
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
        setLoading: (state, action) => {
            state.loading = action.payload
        }
    },
    extraReducers: (builder => {
        // ADD TASK TO SPRINT
        builder.addCase(addTaskToSprintAsync.pending, (state, action) => {
            const { sprintId } = action.meta.arg;

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            if(state.userData === null || state.userData === undefined) return;

            state.userData?.sprints[sprintIndex].tasks.push(mapUpdateTaskToTask(action.meta.arg.task));

            state.status = 'pendingAddTask';
        });
        builder.addCase(addTaskToSprintAsync.fulfilled, (state, action) => {

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

            state.status = 'idle';
        });
        builder.addCase(addTaskToSprintAsync.rejected, (state, action) => {

            state.status = 'idle';
        });

        // REMOVE TASK FROM SPRINT
        builder.addCase(removeTaskFromSprintAsync.pending, (state, action) => {
            state.status = 'pendingDeleteTask';
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

        // UPDATE TASK 
        builder.addCase(updateTaskAsync.pending, (state, action) => {
            const {sprintId, taskId} = action.meta.arg;

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            if(state.userData === null || state.userData === undefined) return;

            const taskIndex = state.userData?.sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            console.log(action.meta.arg.futureState)

            state.userData?.sprints[sprintIndex].tasks.splice(taskIndex, 1, action.meta.arg.futureState);

            state.status = 'pendingUpdateTask';

            
        });
        builder.addCase(updateTaskAsync.fulfilled, (state, action) => {

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
        builder.addCase(updateTaskAsync.rejected, (state, action) => {
            const {sprintId, taskId} = action.meta.arg;

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            if(state.userData === null || state.userData === undefined) return;

            const taskIndex = state.userData?.sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            var revertedTask = {...action.meta.arg.previousState};

            state.userData?.sprints[sprintIndex].tasks.splice(taskIndex, 1, revertedTask);

            toast.error('Failed to update task state!', {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light'
                });

            state.status = 'idle';
        });

        // ADD SUBTASK

        builder.addCase(addSubTaskToTaskAsync.pending, (state, action) => {
            const {sprintId, taskId} = action.meta.arg;

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            if(state.userData === null || state.userData === undefined) return;

            const taskIndex = state.userData?.sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            state.userData?.sprints[sprintIndex].tasks[taskIndex].subTasks.push(action.meta.arg.newSubtask)

            state.status = 'pendingUpdateTask';

            
        });
        builder.addCase(addSubTaskToTaskAsync.fulfilled, (state, action) => {

            state.status = 'idle';

            toast.success('Subtask added!', {
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
        builder.addCase(addSubTaskToTaskAsync.rejected, (state, action) => {
            const {sprintId, taskId} = action.meta.arg;

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            if(state.userData === null || state.userData === undefined) return;

            const taskIndex = state.userData?.sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            state.userData?.sprints[sprintIndex].tasks[taskIndex].subTasks.pop();

            toast.error('Failed to add subtask!', {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light'
                });

            state.status = 'idle';
        });

        // UPDATE SUBTASK
        builder.addCase(updateSubtaskStateAsync.pending, (state, action) => {
            const {sprintId, taskId, subtaskId} = action.meta.arg;

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            if(state.userData === null || state.userData === undefined) return;

            const taskIndex = state.userData?.sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            const subtaskIndex = state.userData?.sprints[sprintIndex].tasks[taskIndex].subTasks.findIndex(s => s.subTaskEntityId === subtaskId);

            if (subtaskIndex === undefined || subtaskIndex < 0) return;

            state.userData?.sprints[sprintIndex].tasks[taskIndex].subTasks.splice(subtaskIndex, 1, action.meta.arg.updatedSubtask);

            state.status = 'pendingUpdateSubtask';

            
        });
        builder.addCase(updateSubtaskStateAsync.fulfilled, (state, action) => {

            state.status = 'idle';

            toast.success('Subtask updated!', {
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
        builder.addCase(updateSubtaskStateAsync.rejected, (state, action) => {
            const {sprintId, taskId, subtaskId} = action.meta.arg;

            const sprintIndex = state.userData?.sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            if(state.userData === null || state.userData === undefined) return;

            const taskIndex = state.userData?.sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            const subtaskIndex = state.userData?.sprints[sprintIndex].tasks[taskIndex].subTasks.findIndex(s => s.subTaskEntityId === subtaskId);

            if (subtaskIndex === undefined || subtaskIndex < 0) return;

            state.userData?.sprints[sprintIndex].tasks[taskIndex].subTasks.splice(subtaskIndex, 1);

            toast.error('Failed to add subtask!', {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light'
                });

            state.status = 'idle';
        });

        // LOGIN USER

        builder.addCase(fetchCurrentUser.rejected, (state) => {
            state.userData = null;
            localStorage.removeItem('user');
            toast.error('Session expired! Please login again', {
                position: "bottom-right",
                autoClose: 1500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'light'
                });
            history.push('/');
        })
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.userData = action.payload
        });
        builder.addMatcher(isAnyOf(signInUser.rejected), (state, action) => {
            throw action.payload;
        });
        
    })
    
})

export const {setUser, setLoading} = userSlice.actions;