import { Box, Card, Grid, Switch, Typography } from "@mui/material";
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
import { addTaskToSprintAsync } from "app/state/userSlice";
import { toast } from "react-toastify";

interface Props {
    setNewTask: (value: boolean) => void
}

export default function NewTaskCardView({setNewTask}: Props) {

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });

    const {control, handleSubmit, watch, formState } = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema)
    });
    
    const [disabled, setDisabled] = useState<boolean>(false);

    const currentEffort = watch("effort", 5);

    const { currentSprint } = useAppSelector(state => state.sprintView);
    const userId = useAppSelector(state => state.user.userData?.userEntityId);
    const dispatch = useAppDispatch();

    const handleAddTask = async (formData: FieldValues) => {

        if(userId == null) return;
        if(currentSprint == null) return;

        const createdDate = new Date().toString();

        console.log(createdDate)

        var newTask = {
           taskEntityId: uuidv4(),
           name: formData.name,
           description: formData.description,
           links: formData.taskLinks.join("|"),
           dateCreated: createdDate,
           dateFinished: "",
           dueDate: formData.dueDate.toString(),
           currentState: 0,
           tags: formData.taskTags.join("|"),
           effort: formData.effort,
           color: 0
        }

        dispatch(addTaskToSprintAsync({userId: userId, sprintId: currentSprint, task: newTask})).catch((error) => {console.log(error); toast.error("Failed to create task")}).finally(() => setNewTask(false));
    }


    return (
        <Card elevation={1} sx={{background: 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)', marginBottom: '10px'}}>
            <Typography variant="h6" margin="5% 6% 20px 6%" sx={{color: 'white', fontFamily:'Open Sans', fontWeight:'700', fontSize:'22px'}}>New Task</Typography>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit((data) => handleAddTask(data))}>
                    <Grid container margin='10px' columns={24}>
                        <Grid item xs={21}>
                            <WhiteTransparentTextField control={control} label="Task Name" name="name"/>
                            <WhiteTransparentTextField control={control} label="Description" name="description" lines={3}/>
                            <WhiteTransparentAutoComplete control={control} label="Tags" placeholder="tags" name="taskTags" />
                            <WhiteTransparentAutoComplete control={control} label="Links" placeholder="links" name="taskLinks" />
                            <Grid container alignItems="center"
                                    justifyContent="center" sx={{marginBottom: '10px'}}>
                                <Grid item xs={2}>
                                    <Switch color="default" defaultChecked={false} onClick={() => setDisabled(!disabled)} />
                                </Grid>
                                <Grid item xs={10}>
                                    <WhiteTransparentDatePicker disabled={!disabled} control={control} name="dueDate" />
                                </Grid>
                            </Grid>
                            <Box width='90%' flexGrow={1} margin='auto'>
                            <Typography variant="caption" sx={{color: 'white'}}>Estimated effort &#40;{currentEffort}&#41;</Typography>
                                <WhiteTransparentEffortSlider name="effort" control={control}/>
                            </Box>
                            <Grid container sx={{display: 'flex', width: 'auto', marginLeft: '5px', marginBottom:'10px'}}>
                                <Grid item xs={12}>
                                    <Box sx={{flexGrow: 1, textAlign: 'right', marginTop: '5px'}}>
                                        <AddTaskOptionsButton setNewTask={setNewTask}/>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </FormProvider>
        </Card>
    )
}