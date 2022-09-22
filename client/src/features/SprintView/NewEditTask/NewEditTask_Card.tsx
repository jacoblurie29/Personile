import { Box, Card, Grid, Switch, Typography, Zoom } from "@mui/material";
import NewEditTaskAutoComplete from "./NewEditTask_AutoComplete";
import { useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import NewEditTaskDatePicker from "./NewEditTask_DatePicker";
import NewEditTaskEffortSlider from "./NewEditTask_EffortSlider";
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from "../Validation/newTaskValidation";
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { addTaskToSprintAsync, updateTaskAsync } from "app/state/userSlice";
import { toast } from "react-toastify";
import { Task } from "app/models/task";
import { Board } from "app/models/board";
import NewEditTaskTextField from "./NewEditTask_TextField";
import NewEditTaskMilestoneSelect from "./NewEditTask_MilestoneSelect";
import NewEditTaskOptionsButton from "./NewEditTask_OptionsButton";


interface Props {
    setNewTask: (value: boolean) => void,
    editTask?: Task,
    toggleEditTask: (taskId: string) => void
}

export default function NewEditTaskCard({setNewTask, editTask, toggleEditTask}: Props) {


    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });

    const {control, handleSubmit, watch } = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });
    
    const [disabled, setDisabled] = useState<boolean>(editTask?.dueDate !== "" || false);
    const currentEffort = watch("effort", 5);
    const { currentSprint, currentBoard } = useAppSelector(state => state.sprintView);
    const userId = useAppSelector(state => state.user.userData?.userEntityId);
    const sprints = useAppSelector(state => state.user.userData?.boards.find(b => b.boardEntityId === currentBoard)?.sprints);
    const board = useAppSelector(state => state.user.userData?.boards.find(b => b.boardEntityId == currentBoard));
    const dispatch = useAppDispatch();


    const handleAddOrUpdateTask = async (formData: FieldValues) => {

        console.log(userId)

        if(userId == null) return;
        if(currentSprint == null) return;
        if(currentBoard == null) return;

        const createdDate = new Date().toString();

        console.log(formData)
        
        var tags = formData.tags === [] ? "" : formData.taskTags.join("|");
        var links = formData.links === [] ? "" : formData.taskLinks.join("|");
        var milestones = formData.milestones === [] ? "" : formData.milestones.join("|");


        // undefined: newTask, not undefined: updatedTask
        if(editTask === undefined) {
            var newTask = {
                taskEntityId: uuidv4(),
                name: formData.name,
                description: formData.description,
                links: links,
                dateCreated: createdDate.substring(0, 15),
                dateFinished: "",
                dueDate: formData.dueDate.toString().substring(0, 15),
                currentState: 0,
                tags: tags,
                effort: formData.effort,
                color: 0,
                milestoneIds: milestones
             }
             console.log(newTask)
             setNewTask(false);
             console.log("DEBUG: " + userId + " " + currentBoard + " " + currentSprint);
             dispatch(addTaskToSprintAsync({userId: userId, boardId: currentBoard, sprintId: currentSprint, task: newTask})).catch((error) => {console.log(error); toast.error("Failed to create task")});
        
        } else {
            if(editTask === undefined) return;

            var currentSprintEntity = sprints?.find(s => s.sprintEntityId === currentSprint);

            var currentTaskEntity = currentSprintEntity?.tasks.find(t => t.taskEntityId === editTask.taskEntityId)
            if(currentTaskEntity === undefined) return;

            var currentSubtasks = currentTaskEntity?.subTasks;
            if(currentSubtasks === undefined) return;

            if(editTask == currentTaskEntity) {
                toggleEditTask(currentTaskEntity.taskEntityId);
                return;
            }

            var dueDate = formData.dueDate.toString() === "Invalid Date" ? "" : formData.dueDate.toString().substring(0, 15);

            var newEditTask = {
                taskEntityId: editTask.taskEntityId,
                name: formData.name,
                description: formData.description,
                links: links,
                dateCreated: editTask.dateCreated.substring(0, 15),
                dateFinished: "",
                dueDate: dueDate,
                currentState: editTask.currentState,
                tags: tags,
                effort: formData.effort,
                color: 0,
                milestoneIds: formData.milestones.join("|")
            }

            var futureTaskEntity = {...newEditTask, subTasks: currentSubtasks}
            var currentTaskId = newEditTask.taskEntityId;
            if(futureTaskEntity === undefined) return;


            
            dispatch(updateTaskAsync(({userId: userId, boardId: currentBoard, sprintId: currentSprint, taskId: currentTaskId, updatedTaskDto: newEditTask, previousState: editTask, futureState: futureTaskEntity}))).catch((error) => {console.log(error); toast.error("Failed to create task")}).finally(() => toggleEditTask(newEditTask.taskEntityId!));;
        }
    }


    return (
        <Zoom in={true} timeout={800}>
            <Card elevation={1} sx={{background: "background.paper", marginBottom: '10px', marginTop: '10px'}}>
                <Typography margin="5% 10% 3% 4%" sx={{color: 'grey.800', fontSize: '20px'}}>{editTask === undefined ? "Add Task" : "Edit Task"}</Typography>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit((data) => handleAddOrUpdateTask(data))}>
                        <Grid container margin='10px' columns={24}>
                            <Grid item xs={21}>
                                <NewEditTaskTextField control={control} label="Task Name" name="name" editvalue={editTask?.name}/>
                                <NewEditTaskTextField control={control} label="Description" name="description" lines={3} editvalue={editTask?.description}/>
                                <NewEditTaskAutoComplete control={control} label="Tags" placeholder="Tags" name="taskTags" editvalue={editTask?.tags.split("|")}/>
                                <NewEditTaskAutoComplete control={control} label="Links" placeholder="Links" name="taskLinks" editvalue={editTask?.links.split("|")}/>
                                <NewEditTaskMilestoneSelect editvalue={editTask?.milestoneIds} name="milestones" label="milestones" placeholder="Milestones" board={board || {} as Board} control={control}/>
                                <Grid container alignItems="center" display='flex'
                                        justifyContent="center" sx={{marginBottom: '10px'}}>
                                    <Grid item xs={2} display= 'flex' justifyContent='center'>
                                        <Switch sx={{ml: '10px', color: 'primary.light'}} defaultChecked={editTask?.dueDate !== ""} onClick={() => setDisabled(!disabled)} />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <NewEditTaskDatePicker disabled={!disabled} control={control} name="dueDate" editvalue={editTask?.dueDate}/>
                                    </Grid>
                                </Grid>
                                <Box width='90%' flexGrow={1} margin='auto'>
                                <Typography variant="caption" sx={{color: 'grey.600'}}>Estimated effort &#40;{currentEffort}&#41;</Typography>
                                    <NewEditTaskEffortSlider name="effort" control={control}/>
                                </Box>
                                <Grid container sx={{display: 'flex', width: 'auto', marginLeft: '5px', marginBottom:'10px'}}>
                                    <Grid item xs={12}>
                                        <Box sx={{flexGrow: 1, textAlign: 'right', marginTop: '5px'}}>
                                            <NewEditTaskOptionsButton setNewTask={setNewTask} isEdit={editTask === undefined} toggleEditTask={toggleEditTask} task={editTask}/>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </FormProvider>
            </Card>
        </Zoom>
    )
}