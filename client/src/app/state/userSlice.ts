import { createAsyncThunk, createSlice, current, isAnyOf } from "@reduxjs/toolkit";
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
import { setCurrentBoard, setCurrentSprint } from "features/SprintView/Redux/sprintSlice";
import { Board } from "app/models/board";
import { UpdateBoard } from "app/models/updateBoard";
import { integerPropType } from "@mui/utils";

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


export const addTaskToSprintAsync = createAsyncThunk<Sprint, {userId: string, boardId: string, sprintId: string, task: UpdateTask}>(
    'sprint/addTaskToSprintAsync',
    async ({userId, boardId, sprintId, task}, thunkAPI) => {
        try {
            return await agent.UserData.addTask(userId, boardId, sprintId, task);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const removeTaskFromSprintAsync = createAsyncThunk<void, {userId: string, boardId: string, sprintId: string, taskId: string}>(
    'sprint/removeTaskFromSprintAsync',
    async ({userId, boardId, sprintId, taskId}, thunkAPI) => {
        try {
            return await agent.UserData.removeTask(userId, boardId, sprintId, taskId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const updateTaskAsync = createAsyncThunk<Task, {userId: string, boardId: string, sprintId: string, taskId: string, updatedTaskDto: UpdateTask, previousState: Task, futureState: Task}>(
    'sprint/updateTask',
    async ({userId, boardId, sprintId, taskId, updatedTaskDto}, thunkAPI) => {
        try {
            return await agent.UserData.updateTask(userId, boardId, sprintId, taskId, updatedTaskDto);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const addSubTaskToTaskAsync = createAsyncThunk<SubTask, {userId: string, boardId: string, sprintId: string, taskId: string, newSubtask: SubTask}>(
    'sprint/addSubtaskToTask',
    async ({userId, boardId, sprintId, taskId, newSubtask}, thunkAPI) => {
        try {
            return await agent.UserData.addSubtask(userId, boardId, sprintId, taskId, newSubtask)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
) 

export const updateSubtaskAsync = createAsyncThunk<SubTask, {userId: string, boardId: string, sprintId: string, taskId: string, subtaskId: string, updatedSubtask: SubTask}>(
    'sprint/updateSubtaskAsync',
    async ({userId, boardId, sprintId, taskId, subtaskId, updatedSubtask}, thunkAPI) => {
        try {
            return await agent.UserData.updateSubtask(userId, boardId, sprintId, taskId, subtaskId, updatedSubtask)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const removeSubtaskFromTaskAsync = createAsyncThunk<void, {userId: string, boardId: string, sprintId: string, taskId: string, subtaskId: string}>(
    'sprint/removeSubtaskFromTaskAsync',
    async ({userId, boardId, sprintId, taskId, subtaskId}, thunkAPI) => {
        try {
            return await agent.UserData.removeSubtask(userId, boardId, sprintId, taskId, subtaskId)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const signInUserAsync = createAsyncThunk<User, FieldValues>(
    'account/signInUser',
    async (data, thunkAPI) => {
        try {
            const userDto = await agent.Account.login(data);
            if (userDto) thunkAPI.dispatch(setUser(userDto));
            localStorage.setItem('user', JSON.stringify(userDto));

            store.dispatch(setCurrentBoard(userDto.boards[0].boardEntityId))
            store.dispatch(setCurrentSprint(userDto.boards[0].sprints[0].sprintEntityId));
            return userDto;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const registerUserAsync = createAsyncThunk<User, FieldValues>(
    'account/registerUser',
    async (data, thunkAPI) => {
        try {
            const userDto = await agent.Account.register(data);
            if (userDto) thunkAPI.dispatch(setUser(userDto));
            localStorage.setItem('user', JSON.stringify(userDto));

            store.dispatch(setCurrentBoard(userDto.boards[0].boardEntityId))
            store.dispatch(setCurrentSprint(userDto.boards[0].sprints[0].sprintEntityId));

            return userDto;
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data});
        }
    }
)

export const fetchCurrentUserAsync = createAsyncThunk<User>(
    'account/fetchCurrenUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user')!)))
        try {
            const userDto = await agent.Account.currentUser();
            if (userDto) thunkAPI.dispatch(setUser(userDto));
            localStorage.setItem('user', JSON.stringify(userDto));
            
            store.dispatch(setCurrentBoard(userDto.boards[0].boardEntityId))
            store.dispatch(setCurrentSprint(userDto.boards[0].sprints[0].sprintEntityId));

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

export const addBoardAsync = createAsyncThunk<User, {userId: string, board: Board}>(
    'sprint/addBoard',
    async ({userId, board}, thunkAPI) => {
        try {
            var userDto = await agent.UserData.addBoard(userId, board);
            store.dispatch(setBoards(userDto.boards));

            return userDto;
            
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
) 

export const updateBoardAsync = createAsyncThunk<Board, {userId: string, boardId: string, updateBoardDto: UpdateBoard, futureState: Board, previousState: Board}>(
    'sprint/updateBoard',
    async ({userId, boardId, updateBoardDto, futureState, previousState}, thunkAPI) => {
        try {
            return await agent.UserData.updateBoard(userId, boardId, updateBoardDto)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
) 

export const deleteBoardAsync = createAsyncThunk<void, {userId: string, boardId: string}>(
    'sprint/deleteBoard',
    async ({userId, boardId}, thunkAPI) => {
        try {
            return await agent.UserData.deleteBoard(userId, boardId)
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
) 

export const addTaskToMilestoneAsync = createAsyncThunk<Sprint, {userId: string, boardId: string, milestoneId: string, sprintId: string, taskId: string}>(
    'sprint/addTaskToMilestoneAsync',
    async ({userId, boardId, milestoneId, sprintId, taskId}, thunkAPI) => {
        try {
            return await agent.UserData.addTaskToMilestone(userId, boardId, milestoneId, sprintId, taskId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const removeTaskFromMilestoneAsync = createAsyncThunk<void, {userId: string, boardId: string, milestoneId: string, sprintId: string, taskId: string}>(
    'sprint/removeTaskFromMilestoneAsync',
    async ({userId, boardId, milestoneId, sprintId, taskId}, thunkAPI) => {
        try {
            return await agent.UserData.removeTaskFromMilestone(userId, boardId, milestoneId, sprintId, taskId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)

export const moveTaskOrderAsync = createAsyncThunk<void, {userId: string, boardId: string, sprintId: string, taskId: string, oldOrder: string, newOrder: string}>(
    'sprint/moveTaskOrder',
    async ({userId, boardId, sprintId, taskId, newOrder}, thunkAPI) => {
        try {
            return await agent.UserData.changeTaskOrder(userId, boardId, sprintId, taskId, newOrder);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)


export const changeTaskStateAsync = createAsyncThunk<void, {userId: string, boardId: string, sprintId: string, taskId: string, newState: string, oldOrder: string, newOrder: string}>(
    'sprint/changeTaskState',
    async ({userId, boardId, sprintId, taskId, newState, newOrder}, thunkAPI) => {
        try {
            return await agent.UserData.changeTaskState(userId, boardId, sprintId, taskId, newState, newOrder);
        } catch (error: any) {
            return thunkAPI.rejectWithValue({error: error.data})
        }
    }
)


export const changeTaskSprintAsync = createAsyncThunk<void, {userId: string, boardId: string, sprintId: string, taskId: string, newSprintId: string}>(
    'sprint/changeTaskSprint',
    async ({userId, boardId, sprintId, taskId, newSprintId}, thunkAPI) => {
        try {
            return await agent.UserData.changeTaskSprint(userId, boardId, sprintId, taskId, newSprintId);
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
        setBoards: (state, action) => {
            if (state.userData === null) return;
            state.userData.boards = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        signOut: (state) => {
            state.userData = null;
            localStorage.removeItem('user');
            history.push('/');
        }
    },
    extraReducers: (builder => {

        // CHANGE TASK SPRINT
        builder.addCase(changeTaskSprintAsync.pending, (state, action) => {
            const {sprintId, taskId, newSprintId, boardId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);
            if (boardIndex === undefined || boardIndex < 0) return;


            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);
            if (sprintIndex === undefined || sprintIndex < 0) return;

            const newSprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === newSprintId);
            if (newSprintIndex === undefined || newSprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);
            if (taskIndex === undefined || taskIndex < 0) return;

            var currentTask = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex];
            var currentSprint = state.userData?.boards[boardIndex].sprints[sprintIndex];
            var newSprint = state.userData?.boards[boardIndex].sprints[newSprintIndex];

            newSprint.tasks.push(currentTask);
            currentSprint.tasks.splice(taskIndex, 1);
            
            state.status = 'pendingMoveTaskSprint';
        });
        builder.addCase(changeTaskSprintAsync.fulfilled, (state, action) => {


            state.status = 'idle';

            toast.success('Task sprint changed!', {
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
        builder.addCase(changeTaskSprintAsync.rejected, (state, action) => {

            toast.error('Failed to change sprint!', {
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

        // CHANGE TASK STATE
        builder.addCase(changeTaskStateAsync.pending, (state, action) => {
            const {sprintId, taskId, newState, newOrder, oldOrder, boardId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);
            if (boardIndex === undefined || boardIndex < 0) return;


            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);
            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            var currentTask = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex];
            currentTask.currentState = Number.parseInt(newState);

            var allTaskOrders = [] as number[]
            state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.sort((a, b) => a.order - b.order).map((task) => allTaskOrders.push(task.order));

            var newPosition = Number.parseInt(newOrder);
            var oldPosition =  Number.parseInt(oldOrder);

            allTaskOrders.splice(oldPosition, 1);
            allTaskOrders.splice(newPosition, 0, oldPosition);
            
            if(state.userData !== null) {
                
                var index = 0;
                state.userData.boards[boardIndex].sprints[sprintIndex].tasks.sort((a, b) => a.order - b.order).map(task => {task.order = allTaskOrders[index]; index++;});
                
            }

            state.status = 'pendingMoveTaskState';
        });
        builder.addCase(changeTaskStateAsync.fulfilled, (state, action) => {


            state.status = 'idle';

            toast.success('Task state and order changed!', {
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
        builder.addCase(changeTaskStateAsync.rejected, (state, action) => {

            toast.error('Failed to change state and order!', {
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

        // SWAP TASK ORDERS
        builder.addCase(moveTaskOrderAsync.pending, (state, action) => {
            const {sprintId, taskId, newOrder, oldOrder, boardId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);
            if (boardIndex === undefined || boardIndex < 0) return;


            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);
            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            var allTaskOrders = [] as number[]
            state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.sort((a, b) => a.order - b.order).map((task) => allTaskOrders.push(task.order));

            var newPosition = Number.parseInt(newOrder);
            var oldPosition =  Number.parseInt(oldOrder);

            allTaskOrders.splice(oldPosition, 1);
            allTaskOrders.splice(newPosition, 0, oldPosition);
            
            if(state.userData !== null) {
                
                var index = 0;
                state.userData.boards[boardIndex].sprints[sprintIndex].tasks.sort((a, b) => a.order - b.order).map(task => {task.order = allTaskOrders[index]; index++;});
                
            }

            state.status = 'pendingMoveTaskOrder';
        });
        builder.addCase(moveTaskOrderAsync.fulfilled, (state, action) => {


            state.status = 'idle';

            toast.success('Task order changed!', {
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
        builder.addCase(moveTaskOrderAsync.rejected, (state, action) => {

            toast.error('Failed to change order!', {
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
        // REMOVE TASK FROM MILESTONE
        builder.addCase(removeTaskFromMilestoneAsync.pending, (state, action) => {

            const {sprintId, taskId, boardId, milestoneId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            if(state.userData !== null) {
                var milestoneIds = [...state.userData.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].milestoneIds.split("|")];

                var indexOfDelete = milestoneIds.indexOf(milestoneId);

                milestoneIds.splice(indexOfDelete, 1);

                state.userData.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].milestoneIds = milestoneIds.join("|");

            }

            state.status = 'pendingRemoveTaskFromMilestone';
        });
        builder.addCase(removeTaskFromMilestoneAsync.fulfilled, (state, action) => {
            state.status = 'idle';
        });
        builder.addCase(removeTaskFromMilestoneAsync.rejected, (state, action) => {

            const {sprintId, taskId, boardId, milestoneId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            var milestoneIds = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].milestoneIds;

            if(state.userData !== null) {
                state.userData.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].milestoneIds = milestoneIds.length == 0 ? milestoneId : milestoneIds +=  "|" + milestoneId;
            }
            
            if (milestoneIds.concat("|" + milestoneId).charAt(0) === "|") {
                state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].milestoneIds.substring(1, state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].milestoneIds.length);
            }

            
        });

        // ADD TASK TO MILESTONE
        builder.addCase(addTaskToMilestoneAsync.pending, (state, action) => {

            const {sprintId, taskId, boardId, milestoneId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            var pastMilestoneIds = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].milestoneIds;

            console.log("PAST IDs: " + pastMilestoneIds);

            if(state.userData !== null) {
                state.userData.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].milestoneIds = pastMilestoneIds === milestoneId ? milestoneId : pastMilestoneIds +=  "|" + milestoneId;
            }


            state.status = 'pendingAddTaskToMilestone';
        });
        builder.addCase(addTaskToMilestoneAsync.fulfilled, (state, action) => {
            state.status = 'idle';
        });
        builder.addCase(addTaskToMilestoneAsync.rejected, (state, action) => {

            const {sprintId, taskId, boardId, milestoneId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            var milestoneIds = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].milestoneIds;

            if(state.userData !== null) {
                state.userData.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].milestoneIds.substring(milestoneIds.length - (milestoneId.length + 1), milestoneIds.length);
            }

            state.status = 'idle';
        });

        // DELETE BOARD
        builder.addCase(deleteBoardAsync.pending, (state, action) => {
            state.status = 'pendingDeleteBoard';
        });
        builder.addCase(deleteBoardAsync.fulfilled, (state, action) => {
            const {boardId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            state.userData?.boards.splice(boardIndex, 1);

            state.status = 'idle';
        });
        builder.addCase(deleteBoardAsync.rejected, (state, action) => {
            state.status = 'idle';
        });

        // UPDATE BOARD 
        builder.addCase(updateBoardAsync.pending, (state, action) => {
            const {boardId, futureState} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            state.userData?.boards.splice(boardIndex, 1, futureState);

            state.status = 'pendingUpdateTask';

        });
        builder.addCase(updateBoardAsync.fulfilled, (state, action) => {

            state.status = 'idle';

            toast.success('Board updated!', {
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
        builder.addCase(updateBoardAsync.rejected, (state, action) => {
            const {boardId, previousState} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            state.userData?.boards.splice(boardIndex, 1, previousState);

            toast.error('Failed to update board!', {
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
        
        // ADD BOARD
        builder.addCase(addBoardAsync.pending, (state, action) => {

            if(state.userData === null || state.userData === undefined) return;

            state.status = 'pendingAddBoard';
        });
        builder.addCase(addBoardAsync.fulfilled, (state, action) => {

            toast.success('Board added!', {
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
        builder.addCase(addBoardAsync.rejected, (state, action) => {
            toast.error('Failed to add board!', {
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

        // ADD TASK TO SPRINT
        builder.addCase(addTaskToSprintAsync.pending, (state, action) => {
            const { sprintId, boardId } = action.meta.arg;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            if(state.userData === null || state.userData === undefined) return;

            state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.push(mapUpdateTaskToTask(action.meta.arg.task));

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
            const {sprintId, taskId, boardId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.splice(taskIndex, 1);

            state.status = 'idle';
        });
        builder.addCase(removeTaskFromSprintAsync.rejected, (state, action) => {
            state.status = 'idle';
        });

        // UPDATE TASK 
        builder.addCase(updateTaskAsync.pending, (state, action) => {
            const {sprintId, taskId, boardId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.splice(taskIndex, 1, action.meta.arg.futureState);

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
            const {sprintId, taskId, boardId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            var revertedTask = {...action.meta.arg.previousState};

            state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.splice(taskIndex, 1, revertedTask);

            toast.error('Failed to update task!', {
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
            const {sprintId, taskId, boardId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].subTasks.push(action.meta.arg.newSubtask)

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
            const {sprintId, taskId, boardId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].subTasks.pop();

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
        builder.addCase(updateSubtaskAsync.pending, (state, action) => {
            const {boardId, sprintId, taskId, subtaskId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            const subtaskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].subTasks.findIndex(s => s.subTaskEntityId === subtaskId);

            if (subtaskIndex === undefined || subtaskIndex < 0) return;

            state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].subTasks.splice(subtaskIndex, 1, action.meta.arg.updatedSubtask);

            state.status = 'pendingUpdateSubtask';

            
        });
        builder.addCase(updateSubtaskAsync.fulfilled, (state, action) => {

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
        builder.addCase(updateSubtaskAsync.rejected, (state, action) => {
            const {boardId, sprintId, taskId, subtaskId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            const subtaskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].subTasks.findIndex(s => s.subTaskEntityId === subtaskId);

            if (subtaskIndex === undefined || subtaskIndex < 0) return;

            state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].subTasks.splice(subtaskIndex, 1);

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

        // REMOVE SUBTASK FROM TASK
        builder.addCase(removeSubtaskFromTaskAsync.pending, (state, action) => {
            const {sprintId, taskId, boardId, subtaskId} = action.meta.arg;

            if(state.userData === null || state.userData === undefined) return;

            const boardIndex = state.userData?.boards.findIndex(b => b.boardEntityId === boardId);

            if (boardIndex === undefined || boardIndex < 0) return;

            const sprintIndex = state.userData?.boards[boardIndex].sprints.findIndex(s => s.sprintEntityId === sprintId);

            if (sprintIndex === undefined || sprintIndex < 0) return;

            const taskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks.findIndex(t => t.taskEntityId === taskId);

            if (taskIndex === undefined || taskIndex < 0) return;

            const subtaskIndex = state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].subTasks.findIndex(s => s.subTaskEntityId === subtaskId);

            if (subtaskIndex === undefined || subtaskIndex < 0) return;

            state.userData?.boards[boardIndex].sprints[sprintIndex].tasks[taskIndex].subTasks.splice(subtaskIndex, 1);

            state.status = 'pendingDeleteSubtask';
        });
        builder.addCase(removeSubtaskFromTaskAsync.fulfilled, (state, action) => {

            toast.success('Subtask deleted!', {
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
        builder.addCase(removeSubtaskFromTaskAsync.rejected, (state, action) => {

            toast.error('Failed to delete subtask!', {
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


        // FETCH USER

        builder.addCase(fetchCurrentUserAsync.rejected, (state) => {
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
        builder.addMatcher(isAnyOf(signInUserAsync.fulfilled, registerUserAsync.fulfilled, fetchCurrentUserAsync.fulfilled), (state, action) => {
            state.userData = action.payload
        });
        builder.addMatcher(isAnyOf(signInUserAsync.rejected), (state, action) => {
            throw action.payload;
        });



        
        
    })
    
})

export const {setUser, setBoards, setLoading, signOut} = userSlice.actions;