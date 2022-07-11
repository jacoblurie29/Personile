import { Box, Card, Collapse, Grid, Grow, Switch, Typography } from "@mui/material";
import WhiteTransparentAutoComplete from "./WhiteTransparentAutoComplete";
import WhiteTransparentTextField from "./WhiteTransparentTextField";
import { useState } from "react";
import AddTaskOptionsButton from "./AddTaskOptionsButton";
import { FieldValue, FieldValues, FormProvider, useForm } from "react-hook-form";
import WhiteTransparentDatePicker from "./WhiteTransparentDatePicker";
import WhiteTransparentEffortSlider from "./WhiteTransparentEffortSlider";
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from "./newTaskValidation";
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { addTaskToSprintAsync, updateTaskAsync as updateTaskAsync } from "app/state/userSlice";
import { toast } from "react-toastify";
import { Task } from "app/models/task";


interface Props {
    setNewTask: (value: boolean) => void,
    editTask?: Task,
    toggleEditTask: (taskId: string) => void
}

export default function TaskCardViewEditor({setNewTask, editTask, toggleEditTask}: Props) {

    function chooseColor(title: number) {
        return title === 0 
            ? 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)' 
            : title === 1 ? 'linear-gradient(90deg, rgba(255,209,125,1) 0%, rgba(255,196,54,1) 100%)' 
            : 'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)'
    }

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });

    const {control, handleSubmit, watch, formState } = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });
    
    const [disabled, setDisabled] = useState<boolean>(editTask?.dueDate != "" || false);
    const currentEffort = watch("effort", 5);
    const { currentSprint } = useAppSelector(state => state.sprintView);
    const userId = useAppSelector(state => state.user.userData?.userEntityId);
    const sprints = useAppSelector(state => state.user.userData?.sprints);
    const dispatch = useAppDispatch();


    const handleAddOrUpdateTask = async (formData: FieldValues) => {


        if(userId == null) return;
        if(currentSprint == null) return;

        const createdDate = new Date().toString();

        console.log(formData)
        
        var tags = formData.tags === [] ? "" : formData.taskTags.join("|");
        var links = formData.links === [] ? "" : formData.taskLinks.join("|");

        

        if(editTask == undefined) {
            var newTask = {
                taskEntityId: uuidv4(),
                name: formData.name,
                description: formData.description,
                links: links,
                dateCreated: createdDate,
                dateFinished: "",
                dueDate: formData.dueDate.toString(),
                currentState: 0,
                tags: tags,
                effort: formData.effort,
                color: 0
             }
     
             
     
             console.log(newTask)

             setNewTask(false);

             dispatch(addTaskToSprintAsync({userId: userId, sprintId: currentSprint, task: newTask})).catch((error) => {console.log(error); toast.error("Failed to create task")});
        } else {
            if(editTask == undefined) return;


            var dueDate = formData.dueDate.toString() === "Invalid Date" ? "" : formData.dueDate.toString();

            var newTask = {
                taskEntityId: editTask.taskEntityId,
                name: formData.name,
                description: formData.description,
                links: links,
                dateCreated: editTask.dateCreated,
                dateFinished: "",
                dueDate: dueDate,
                currentState: editTask.currentState,
                tags: tags,
                effort: formData.effort,
                color: 0
             }

             var currentSprintEntity = sprints?.find(s => s.sprintEntityId === currentSprint);
             var currentTaskEntity = currentSprintEntity?.tasks.find(t => t.taskEntityId === editTask.taskEntityId)

             if(currentTaskEntity === undefined) return;

             var currentSubtasks = currentTaskEntity?.subTasks;

             if(currentSubtasks === undefined) return;

             var futureTaskEntity = {...newTask, subTasks: currentSubtasks}
            
             console.log(newTask)
            
             var currentTaskId = newTask.taskEntityId;

             if(futureTaskEntity === undefined) return;

             console.log(futureTaskEntity)

            dispatch(updateTaskAsync(({userId: userId, sprintId: currentSprint, taskId: currentTaskId, updatedTaskDto: newTask, previousState: editTask, futureState: futureTaskEntity}))).catch((error) => {console.log(error); toast.error("Failed to create task")}).finally(() => toggleEditTask(newTask.taskEntityId!));;
        }
    }


    return (
        <Grow in={true}>
            <Card elevation={1} sx={{background: chooseColor(editTask?.currentState || 0), marginBottom: '10px'}}>
                <Typography variant="h6" margin="5% 6% 20px 6%" sx={{color: 'white', fontFamily:'Open Sans', fontWeight:'700', fontSize:'22px'}}>Edit Task</Typography>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit((data) => handleAddOrUpdateTask(data))}>
                        <Grid container margin='10px' columns={24}>
                            <Grid item xs={21}>
                                <WhiteTransparentTextField control={control} label="Task Name" name="name" editvalue={editTask?.name}/>
                                <WhiteTransparentTextField control={control} label="Description" name="description" lines={3} editvalue={editTask?.description}/>
                                <WhiteTransparentAutoComplete control={control} label="Tags" placeholder="Tags" name="taskTags" editvalue={editTask?.tags.split("|")}/>
                                <WhiteTransparentAutoComplete control={control} label="Links" placeholder="Links" name="taskLinks" editvalue={editTask?.links.split("|")}/>
                                <Grid container alignItems="center"
                                        justifyContent="center" sx={{marginBottom: '10px'}}>
                                    <Grid item xs={2}>
                                        <Switch color="default" defaultChecked={editTask?.dueDate != ""} onClick={() => setDisabled(!disabled)} />
                                    </Grid>
                                    <Grid item xs={10}>
                                        <WhiteTransparentDatePicker disabled={!disabled} control={control} name="dueDate" editvalue={editTask?.dueDate}/>
                                    </Grid>
                                </Grid>
                                <Box width='90%' flexGrow={1} margin='auto'>
                                <Typography variant="caption" sx={{color: 'white'}}>Estimated effort &#40;{currentEffort}&#41;</Typography>
                                    <WhiteTransparentEffortSlider name="effort" control={control}/>
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
        </Grow>
    )
}