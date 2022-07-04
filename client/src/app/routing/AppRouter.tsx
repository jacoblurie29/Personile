import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import SettingsView from "../../features/SettingsView/SettingsView";
import SprintView from "../../features/SprintView/SprintView";
import TodayView from "../../features/TodayView/TodayView";
import agent from "../api/agent";
import { useAppContext } from "../context/AppContext";
import NotFound from "../errors/NotFound";
import ServerError from "../errors/ServerError";
import LoadingComponent from "../layout/LoadingComponent";

export default function AppRouter() {

    const {setSprints, setTitles} = useAppContext();
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        agent.Sprints.titles("USER_ID_1")
        .then(titles => setTitles(titles))
        .catch(error => console.log(error));
        

        agent.Sprints.getSprints("USER_ID_1")
            .then(sprints => setSprints(sprints))
            .catch(error => console.log(error))
            .finally(() => {
                setLoading(false);
            });

        
            
    }, [setSprints, setTitles])

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