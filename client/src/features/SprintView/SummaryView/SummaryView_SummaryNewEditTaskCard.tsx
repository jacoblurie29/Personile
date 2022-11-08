import { yupResolver } from "@hookform/resolvers/yup";
import { Card, Typography, Grid, Collapse, Box, Button, Zoom, Switch } from "@mui/material";
import { Board } from "app/models/board";
import { Task } from "app/models/task";
import { addTaskToSprintAsync, addTaskToMilestoneAsync, updateTaskAsync, removeTaskFromMilestoneAsync } from "app/state/userSlice";
import { useAppSelector, useAppDispatch } from "app/store/configureStore";
import { compareTasks, compareTaskMilestones } from "app/util/taskComparisonUtil";
import { useState } from "react";
import { useForm, FieldValues, FormProvider } from "react-hook-form";
import { toast } from "react-toastify";
import NewEditTaskAutoComplete from "../NewEditTask/NewEditTask_AutoComplete";
import NewEditTaskDatePicker from "../NewEditTask/NewEditTask_DatePicker";
import NewEditTaskEffortSlider from "../NewEditTask/NewEditTask_EffortSlider";
import NewEditTaskMilestoneSelect from "../NewEditTask/NewEditTask_MilestoneSelect";
import NewEditTaskOptionsButton from "../NewEditTask/NewEditTask_OptionsButton";
import NewEditTaskTextField from "../NewEditTask/NewEditTask_TextField";
import { validationSchema } from "../Validation/newTaskValidation";
import { v4 as uuidv4 } from 'uuid';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface Props {
    setNewTask: (value: boolean) => void,
    editTask?: Task,
    toggleEditTask: (taskId: string) => void
}

export default function SummaryNewEditTaskCard({setNewTask, editTask, toggleEditTask}: Props) {


    // react hook form
    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });

    // more react hook form
    const {control, handleSubmit, watch} = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });
    
    // state and redux values
    const [disabled, setDisabled] = useState<boolean>(editTask?.dueDate !== "" || false);
    const [addTaskMoreDetails, setAddTaskMoreDetails] = useState<boolean>(false)
    const currentEffort = watch("effort", 5);
    const { currentSprint, currentBoard } = useAppSelector(state => state.sprintView);
    const userId = useAppSelector(state => state.user.userData?.userEntityId);
    const sprints = useAppSelector(state => state.user.userData?.boards.find(b => b.boardEntityId === currentBoard)?.sprints);
    const board = useAppSelector(state => state.user.userData?.boards.find(b => b.boardEntityId == currentBoard));
    const dispatch = useAppDispatch();

    // makes decision to either add or update the focused task after submit button clicked
    const handleAddOrUpdateTask = async (formData: FieldValues) => {

        // undefined: newTask, not undefined: updatedTask
        if(editTask === undefined) {

            handleAddTask(formData);  
        
        } else {

            handleEditTask(formData, editTask);

        }
    }


    const handleAddTask = (formData: FieldValues) => {

        // generate new values
        const newTaskId = uuidv4();
        const createdDate = new Date().toString();

        // shape some data from form
        var tags = formData.taskTags == undefined ? "" : formData.taskTags.length == 0 ? "" : formData.taskTags.join("|");
        var links = formData.taskLinks == undefined ? "" : formData.taskLinks.length == 0 ? "" : formData.taskLinks.join("|");
        var milestones = formData.milestones == undefined ? "" : formData.milestones.join("|");
        var dueDate = formData.dueDate == undefined ? "" : formData.dueDate.toString().substring(0, 15);

        // null checks
        if(userId == null) return;
        if(currentSprint == null) return;
        if(currentBoard == null) return;

        // retrieve entities and undefined check
        var currentSprintEntity = sprints?.find(s => s.sprintEntityId === currentSprint);
        var taskEntities = currentSprintEntity?.tasks;

        // undefined check
        if(taskEntities == undefined) return;

        // create new task object
        var newTask = {
            taskEntityId: newTaskId,
            name: formData.name || "",
            description: formData.description || "",
            links: links || "",
            dateCreated: createdDate.substring(0, 15) || "",
            dateFinished: "",
            dueDate: dueDate,
            currentState: 0,
            tags: tags || "",
            effort: formData.effort || 0,
            color: 0,
            order: taskEntities.length,
            milestoneIds: milestones || ""
         }


         // close new task panel
         setNewTask(false);

         // add new task and add new milestones to the task after
         dispatch(addTaskToSprintAsync({userId: userId, boardId: currentBoard, sprintId: currentSprint, task: newTask})).catch((error) => {console.log(error); toast.error("Failed to create task")}).finally(
            () => {
                formData.milestones.forEach((currentMilestoneId: string) => {
                    dispatch(addTaskToMilestoneAsync(({userId: userId, boardId: currentBoard, milestoneId: currentMilestoneId, sprintId: currentSprint, taskId: newTaskId})))
                 });
            }
         );

         
    }

    const handleEditTask = (formData: FieldValues, editTask: Task) => {

        // null checks
        if(userId == null) return;
        if(currentSprint == null) return;
        if(currentBoard == null) return;

        // shape some data from form
        var tags = formData.taskTags == undefined ? "" : formData.taskTags.length == 0 ? "" : formData.taskTags.join("|");
        var links = formData.taskLinks == undefined ? "" : formData.taskLinks.length == 0 ? "" : formData.taskLinks.join("|");
        var milestones = formData.milestones == undefined ? "" : formData.milestones.join("|");
        var dueDate = formData.dueDate == undefined ? "" : formData.dueDate.toString().substring(0, 15);

        // retrieve entities and undefined check
        var currentSprintEntity = sprints?.find(s => s.sprintEntityId === currentSprint);
        var currentTaskEntity = currentSprintEntity?.tasks.find(t => t.taskEntityId === editTask.taskEntityId);
        if(currentTaskEntity === undefined) return;
        var currentSubtasks = currentTaskEntity?.subTasks;
        if(currentSubtasks === undefined) return;

        // generate new values
        var dueDate = formData.dueDate.toString() === "Invalid Date" ? "" : formData.dueDate.toString().substring(0, 15);

        // create edited task entity with old/new data
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
            order: editTask.order,
            milestoneIds: milestones
        }

        // generate future entity and retrieve current task's id
        var futureTaskEntity = {...newEditTask, subTasks: currentSubtasks}
        var currentTaskId = newEditTask.taskEntityId;

        // undefined check
        if(futureTaskEntity === undefined) return;

        // tasks are NOT equal (task was edited) but the milestones are the SAME
        if(!compareTasks(futureTaskEntity, currentTaskEntity) && compareTaskMilestones(futureTaskEntity, currentTaskEntity)) {

            // only update the task, not the milestones
            dispatch(updateTaskAsync(({userId: userId, boardId: currentBoard, sprintId: currentSprint, taskId: currentTaskId, updatedTaskDto: newEditTask, previousState: editTask, futureState: futureTaskEntity}))).catch((error) => {console.log(error); toast.error("Failed to edit task")}).finally(() => {
                toggleEditTask(newEditTask.taskEntityId!);
            });

        // tasks are equal (not edited) but the milestones WERE edited
        } else if (compareTasks(futureTaskEntity, currentTaskEntity) && !compareTaskMilestones(futureTaskEntity, currentTaskEntity)) {

            // find the milestones that were deleted
            var deletedMilestones = findDeletedMilestonesFromTask(currentTaskEntity?.milestoneIds.split("|"), formData.milestones);

            // loop through the new milestone list to add the new ones
            formData.milestones.forEach((currentMilestoneId: string) => {

                // if old list of milestones doesn't include milestone in question, add that milestone
                if(!currentTaskEntity?.milestoneIds.includes(currentMilestoneId)) {
                    dispatch(addTaskToMilestoneAsync(({userId: userId, boardId: currentBoard, milestoneId: currentMilestoneId, sprintId: currentSprint, taskId: currentTaskId})))
                }
             });   

            // if the milestones are not empty (can't delete anything if theres nothing there)
            if(currentTaskEntity?.milestoneIds !== "") {
            
            // loop through the deleted milestones and remove them one at a time
            deletedMilestones.forEach((deletedMilestone: String) => {
                dispatch(removeTaskFromMilestoneAsync(({userId: userId, boardId: currentBoard, milestoneId: deletedMilestone as string, sprintId: currentSprint, taskId: currentTaskId})));
            });

            }

            // close the edit task window
            toggleEditTask(newEditTask.taskEntityId!);  

        // task was edited AND milestones were edited
        } else if (!compareTasks(futureTaskEntity, currentTaskEntity) && !compareTaskMilestones(futureTaskEntity, currentTaskEntity)) {
                
                // update task values that are not milestones
                dispatch(updateTaskAsync(({userId: userId, boardId: currentBoard, sprintId: currentSprint, taskId: currentTaskId, updatedTaskDto: newEditTask, previousState: editTask, futureState: futureTaskEntity}))).catch((error) => {console.log(error); toast.error("Failed to create task")}).finally(() => {
                
                // find milestones that were deleted
                var deletedMilestones = findDeletedMilestonesFromTask(currentTaskEntity?.milestoneIds.split("|") || [], formData.milestones);

                // loop through the new milestone list to add the new ones
                formData.milestones.forEach((currentMilestoneId: string) => {

                    // if old list of milestones doesn't include milestone in question, add that milestone
                    if(!currentTaskEntity?.milestoneIds.includes(currentMilestoneId)) {
                        dispatch(addTaskToMilestoneAsync(({userId: userId, boardId: currentBoard, milestoneId: currentMilestoneId, sprintId: currentSprint, taskId: currentTaskId})))
                    }                     
                });

                // if the milestones are not empty (can't delete anything if theres nothing there)
                if(currentTaskEntity?.milestoneIds !== "") {
                
                    // loop through the deleted milestones and remove them one at a time
                    deletedMilestones.forEach((deletedMilestone: String) => {
                        dispatch(removeTaskFromMilestoneAsync(({userId: userId, boardId: currentBoard, milestoneId: deletedMilestone as string, sprintId: currentSprint, taskId: currentTaskId})));
                    });
                }

                toggleEditTask(newEditTask.taskEntityId!);

            });
        // neither task or milestones were edited
        } else {

            // close edit task window
            toggleEditTask(newEditTask.taskEntityId!);
            return;
        }

    }

    const findDeletedMilestonesFromTask = (oldMilestones: string[], newMilestones: string[], addedMilestones?: string[]) => {
        
        // base list
        var deletedMilestones = [] as string[];

        // add to list only milestones that are exclusively in old array, those are "deleted"
        oldMilestones.map((old) => {
            if(!newMilestones.includes(old)) {
                deletedMilestones.push(old);
            }
        });

        return deletedMilestones;

    }


    return (
        <Zoom in={true} timeout={800}>
            <Card elevation={1} sx={{background: "background.paper", marginBottom: '10px', marginTop: '10px'}}>
                <Typography margin="20px 5px 5px 20px" variant="h2" sx={{color: 'grey.800', fontSize: '20px'}}>{editTask === undefined ? "Add Task" : "Edit Task"}</Typography>
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit((data) => handleAddOrUpdateTask(data))}>
                        <Grid container margin='10px' columns={24}>
                            <Grid item xs={23}>
                                <Grid container>
                                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12} sx={{padding: "10px"}}>
                                        <NewEditTaskTextField control={control} label="Task Name" name="name" lines={3} editvalue={editTask?.name}/>
                                    </Grid>
                                    <Grid item xl={6} lg={6} md={6} sm={12} xs={12} sx={{padding: "10px"}}>
                                        <NewEditTaskTextField control={control} label="Description" name="description" lines={3} editvalue={editTask?.description}/>
                                    </Grid>
                                </Grid>
                                
                                <Collapse in={addTaskMoreDetails}>
                                    <>
                                        <Grid container>
                                            <Grid item xl={6} lg={6} md={6} sm={12} xs={12} sx={{padding: "10px"}}>
                                                <NewEditTaskAutoComplete control={control} label="Tags" placeholder="Tags" name="taskTags" editvalue={editTask?.tags.split("|")}/>
                                            </Grid>
                                            <Grid item xl={6} lg={6} md={6} sm={12} xs={12} sx={{padding: "10px"}}>
                                                <NewEditTaskAutoComplete control={control} label="Links" placeholder="Links" name="taskLinks" editvalue={editTask?.links.split("|")}/>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xl={6} lg={6} md={6} sm={12} xs={12} sx={{padding: "10px"}}>
                                                <NewEditTaskMilestoneSelect editvalue={editTask?.milestoneIds} name="milestones" label="milestones" placeholder="Milestones" board={board || {} as Board} control={control}/>
                                            </Grid>
                                            <Grid item xl={6} lg={6} md={6} sm={12} xs={12} sx={{padding: "10px"}}>
                                                <Box width='90%' flexGrow={1} margin='auto'>
                                                    <Typography variant="caption" sx={{color: 'grey.600'}}>Estimated effort &#40;{currentEffort}&#41;</Typography>
                                                    <NewEditTaskEffortSlider name="effort" control={control}/>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                        <Grid container alignItems="center" display='flex'
                                                justifyContent="center" sx={{marginBottom: '10px'}}>
                                            <Grid item xs={2} display= 'flex' justifyContent='center'>
                                                <Switch sx={{ml: '10px', color: 'primary.light'}} defaultChecked={editTask?.dueDate !== ""} onClick={() => setDisabled(!disabled)} />
                                            </Grid>
                                            <Grid item xs={10}>
                                                <NewEditTaskDatePicker disabled={!disabled} control={control} name="dueDate" editvalue={editTask?.dueDate}/>
                                            </Grid>
                                        </Grid>
                                    </>
                                </Collapse>
                            </Grid>
                        <Grid container>
                            <Grid item xs={6}>
                                <Box sx={{flexGrow: 1, textAlign: 'left', marginTop: '10px'}}>
                                    <Button size="small" variant="outlined" onClick={() => setAddTaskMoreDetails(!addTaskMoreDetails)}>
                                        More details
                                        {addTaskMoreDetails ? <ArrowDropUpIcon /> : <ArrowDropDownIcon /> }
                                    </Button>
                                </Box>
                            </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{flexGrow: 1, textAlign: 'right', marginTop: '5px', marginRight: '20px'}}>
                                        <NewEditTaskOptionsButton setNewTask={setNewTask} isEdit={editTask === undefined} toggleEditTask={toggleEditTask} task={editTask}/>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </FormProvider>
            </Card>
        </Zoom>
    )
}