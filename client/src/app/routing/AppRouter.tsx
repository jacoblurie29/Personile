import LoginView from "features/AccountViews/LoginView";
import RegisterView from "features/AccountViews/RegisterView";
import { Route, Switch } from "react-router-dom";
import SettingsView from "../../features/SettingsView/SettingsView";
import SprintView from "../../features/SprintView/SprintView";
import TodayView from "../../features/TodayView/TodayView";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import LoadingComponent from "../layout/LoadingComponent";
import { useAppSelector } from "../store/configureStore";

export default function AppRouter() {

    const loading = useAppSelector(state => state.sprintView.loading)


    if(loading) return <LoadingComponent message="Loading sprints..." />

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
            <Route path='/login'>
                <LoginView />
            </Route>
            <Route path='/register'>
                <RegisterView />
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