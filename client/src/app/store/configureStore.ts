import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { sprintSlice } from "../../features/SprintView/Redux/sprintSlice";
import { userSlice } from "../state/userSlice";

//export function configureStore() {
//    return createStore(counterReducer);
//}

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    sprintView: sprintSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
