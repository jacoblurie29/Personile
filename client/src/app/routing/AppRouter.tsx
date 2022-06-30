import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import SettingsView from "../../features/SettingsView/SettingsView";
import SprintView from "../../features/SprintView/SprintView";
import TodayView from "../../features/TodayView/TodayView";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import { Task } from "../models/task";

interface Props {
    sprint: string
}

export default function AppRouter() {


    return(
        <Switch>
            <Route exact path='/'>
                <SprintView />
            </Route>
            <Route path='/sprint'>
                <SprintView />
            </Route>
            <Route path='/today'>
                <TodayView />
            </Route>
            <Route path='/settings'>
                <SettingsView />
            </Route>
            <Route path='/server-error'>
                <ServerError />
            </Route>
            <Route>
                <NotFound />
            </Route>
        </Switch>
        
    )
}