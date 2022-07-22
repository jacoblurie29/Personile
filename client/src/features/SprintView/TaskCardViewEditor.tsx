import { Box, Card, Grid, Switch, Typography, Zoom } from "@mui/material";
import NewEditTaskAutoComplete from "./NewEditTaskAutoComplete";
import WhiteTransparentTextField from "./NewEditTaskTextField";
import { useState } from "react";
import AddTaskOptionsButton from "./AddTaskOptionsButton";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import NewEditTaskDatePicker from "./NewEditTaskDatePicker";
import NewEditTaskEffortSlider from "./NewEditTaskEffortSlider";
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from "./newTaskValidation";
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { addTaskToSprintAsync, updateTaskAsync } from "app/state/userSlice";
import { toast } from "react-toastify";
import { Task } from "app/models/task";


interface Props {
    setNewTask: (value: boolean) => void,
    editTask?: Task,
    toggleEditTask: (taskId: string) => void
}

export default function TaskCardViewEditor({setNewTask, editTask, toggleEditTask}: Props) {


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
                milestoneIds: [] as string[]
             }
             console.log(newTask)
             setNewTask(false);
             dispatch(addTaskToSprintAsync({userId: userId, boardId: currentBoard, sprintId: currentSprint, task: newTask})).catch((error) => {console.log(error); toast.error("Failed to create task")});
        
            } else {
                if(editTask === undefined) return;


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
                    milestoneIds: editTask.milestoneIds
                }

                var currentSprintEntity = sprints?.find(s => s.sprintEntityId === currentSprint);

                var currentTaskEntity = currentSprintEntity?.tasks.find(t => t.taskEntityId === editTask.taskEntityId)
                if(currentTaskEntity === undefined) return;

                var currentSubtasks = currentTaskEntity?.subTasks;
                if(currentSubtasks === undefined) return;

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
                                <WhiteTransparentTextField control={control} label="Task Name" name="name" editvalue={editTask?.name}/>
                                <WhiteTransparentTextField control={control} label="Description" name="description" lines={3} editvalue={editTask?.description}/>
                                <NewEditTaskAutoComplete control={control} label="Tags" placeholder="Tags" name="taskTags" editvalue={editTask?.tags.split("|")}/>
                                <NewEditTaskAutoComplete control={control} label="Links" placeholder="Links" name="taskLinks" editvalue={editTask?.links.split("|")}/>
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
                                <Typography variant="caption" sx={{color: 'white'}}>Estimated effort &#40;{currentEffort}&#41;</Typography>
                                    <NewEditTaskEffortSlider name="effort" control={control}/>
                                </Box>
                                <Grid container sx={{display: 'flex', width: 'auto', marginLeft: '5px', marginBottom:'10px'}}>
                                    <Grid item xs={12}>
                                        <Box sx={{flexGrow: 1, textAlign: 'right', marginTop: '5px'}}>
                                            <AddTaskOptionsButton setNewTask={setNewTask} isEdit={editTask === undefined} toggleEditTask={toggleEditTask} task={editTask}/>
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