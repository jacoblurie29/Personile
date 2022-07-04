import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Sprint } from "../models/sprint";

interface AppContextValue {
    sprints: Sprint[] | null;
    titles: string[] | null;
    setSprints: (sprints: Sprint[]) => void;
    setTitles: (titles: string[]) => void;
    removeTask: (taskId: string, sprintId: string) => void;
    removeSubtask: (subTaskId: string, taskId: string, sprintId: string) => void;
}

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function useAppContext() {
    const context = useContext(AppContext);

    if(context === undefined) {

        throw Error('Oops - we do not seem to be in the provider');

    }
        return context;

    
}

export function AppProvider({children}: PropsWithChildren<any>) {

    const [sprints, setSprints] = useState<Sprint[] | null>(null);
    const [titles, setTitles] = useState<string[] | null>(null);

    function removeTask(taskId: string, sprintId: string) {

        // No sprints, exit
        if (!sprints) return;

        // Finds current sprint
        var currentSprint = sprints.find(sprint => sprint.sprintEntityId === sprintId);

        // Sprint or tasks doesn't exist, exit
        if(currentSprint == null) return;
        if(currentSprint.tasks == null) return;

        // Finds tasks and index in question
        const tasks = [...currentSprint.tasks];
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        // Removes task
        if(taskIndex >= 0) {
            tasks.splice(taskIndex, 1);
            setSprints(prevState => {
                return {...prevState!, tasks}
            })
        }
    }

    function removeSubtask(subtaskId: string, taskId: string, sprintId: string) {
        
        // No sprints, exit
        if (!sprints) return;

        // Finds current sprint
        var currentSprint = sprints.find(sprint => sprint.sprintEntityId === sprintId);

        // Sprint or tasks doesn't exist, exit
        if(currentSprint == null) return;
        if(currentSprint.tasks == null) return;

        // Finds current task
        var currentTask = currentSprint.tasks.find(task => task.id === taskId);

        // Task or subtasks doesn't exist, exit
        if(currentTask == null) return;
        if(currentTask.subTasks == null) return;
        
        const subTasks = [...currentTask.subTasks];
        const subtaskIndex = subTasks.findIndex(s => s.subTaskEntityId === subtaskId);

        if(subtaskIndex >= 0) {
            subTasks.splice(subtaskIndex, 1);
            setSprints(prevState => {
                return {...prevState!, subTasks}
            })
        }


    }

    return (
        <AppContext.Provider value={{sprints, titles, setSprints, setTitles, removeTask, removeSubtask}}>
            {children}
        </AppContext.Provider>
    )

}