import { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import SettingsView from "../../features/SettingsView/SettingsView";
import { setCurrentSprint } from "../../features/SprintView/sprintSlice";
import SprintView from "../../features/SprintView/SprintView";
import TodayView from "../../features/TodayView/TodayView";
import agent from "../api/agent";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import LoadingComponent from "../layout/LoadingComponent";
import { setLoading, setUser } from "../state/userSlice";
import { useAppDispatch, useAppSelector } from "../store/configureStore";

export default function AppRouter() {

    const dispatch = useAppDispatch();
    const { loading } = useAppSelector(state => state.user)

    useEffect(() => {

        dispatch(setLoading(true));

        agent.Sprints.getUser("USER_ID_1")
            .then(user => {
                if(user != null) {
                    dispatch(setUser(user));
                    if(user.sprints !== null || user.sprints.length !== 0) {
                        dispatch(setCurrentSprint(user.sprints[0].sprintEntityId))
                    }
                }
                
            })
            .catch(error => console.log(error))
            .finally(() => {
                dispatch(setLoading(false));
            });

    }, [setUser])

    if(loading) return <LoadingComponent message="Initializing app..." />

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