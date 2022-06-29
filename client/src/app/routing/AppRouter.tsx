import { Route } from "react-router-dom";
import SprintView from "../../features/SprintView/SprintView";
import TodayView from "../../features/TodayView/TodayView";
import { Task } from "../models/task";

interface Props {
    tasks: Task[]
}

export default function AppRouter({tasks}: Props) {

    return(
        <>
            <Route exact path='/'>
                <SprintView tasks={tasks}/>
            </Route>
            <Route path='/sprint'>
                <SprintView tasks={tasks}/>
            </Route>
            <Route path='/today'>
                <TodayView />
            </Route>
        </>
        
    )
}