import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import agent from "../../app/api/agent";
import { Sprint } from "../../app/models/sprint";
import { Task } from "../../app/models/task";

interface SprintState {
    currentSprint: string | null;
    loading: boolean | null;
    isExpanded: string[] | null;
}

const initialState : SprintState = {
    currentSprint: null,
    loading: false,
    isExpanded: []
}

export const sprintSlice = createSlice({
    name: 'sprintView',
    initialState,
    reducers: {
        setCurrentSprint: (state, action) => {
            state.isExpanded = []
            state.currentSprint = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        addToIsExpanded: (state, action) => {
            state.isExpanded?.push(action.payload);
        },
        removeFromIsExpanded: (state, action) => {
            if(state.isExpanded == undefined || state.isExpanded == null) return;

            var index = state.isExpanded?.indexOf(action.payload);
            state.isExpanded?.splice(index, 1);
        }
    }
})

export const {setCurrentSprint, setLoading, addToIsExpanded, removeFromIsExpanded} = sprintSlice.actions;