import { createSlice } from "@reduxjs/toolkit";

interface SprintState {
  currentSprint: string | null;
  currentBoard: string | null;
  loading: boolean | null;
  isExpanded: string[] | null;
}

const initialState: SprintState = {
  currentBoard: null,
  currentSprint: null,
  loading: false,
  isExpanded: [],
};

export const sprintSlice = createSlice({
  name: "sprintView",
  initialState,
  reducers: {
    setCurrentSprint: (state, action) => {
      state.isExpanded = [];
      state.currentSprint = action.payload;
    },
    setCurrentBoard: (state, action) => {
      state.isExpanded = [];
      state.currentBoard = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    addToIsExpanded: (state, action) => {
      state.isExpanded?.push(action.payload);
    },
    removeFromIsExpanded: (state, action) => {
      if (state.isExpanded === undefined || state.isExpanded === null) return;

      var index = state.isExpanded?.indexOf(action.payload);
      state.isExpanded?.splice(index, 1);
    },
  },
});

export const {
  setCurrentSprint,
  setLoading,
  addToIsExpanded,
  removeFromIsExpanded,
  setCurrentBoard,
} = sprintSlice.actions;
