import { useEffect, useState } from "react";
import { Route } from "react-router-dom";
import SprintView from "../../features/SprintView/SprintView";
import TodayView from "../../features/TodayView/TodayView";
import { Task } from "../models/task";

export default function AppRouter() {

    const [tasks, setTasks] = useState<Task[]>([])

    useEffect(() => {
        fetch('http://localhost:5000/api/tasks')
          .then(response => response.json())
          .then(data => setTasks(data))
    }, [])
    

    return(
        <>
            <Route exact path='/'>
                <SprintView tasks={tasks} />
            </Route>
            <Route path='/sprint'>
                <SprintView tasks={tasks} />
            </Route>
            <Route path='/today'>
                <TodayView />
            </Route>
        </>
        
    )
}