import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import SprintView from "../../features/SprintView/SprintView";
import TodayView from "../../features/TodayView/TodayView";
import { Task } from "../models/task";

export default function AppRouter() {

    return(
        <>
            <Route exact path='/'>
                <SprintView />
            </Route>
            <Route path='/sprint'>
                <SprintView />
            </Route>
            <Route path='/today'>
                <TodayView />
            </Route>
        </>
        
    )
}