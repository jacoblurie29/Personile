import { Box, Card, Grid, Slider, Switch, Typography } from "@mui/material";
import WhiteTransparentAutoComplete from "./WhiteTransparentAutoComplete";
import WhiteTransparentTextField from "./WhiteTransparentTextField";
import { useState } from "react";
import AddTaskOptionsButton from "./AddTaskOptionsButton";
import { FormProvider, useForm } from "react-hook-form";
import WhiteTransparentDatePicker from "./WhiteTransparentDatePicker";

interface Props {
    setNewTask: (value: boolean) => void
}

export default function NewTaskCardView({setNewTask}: Props) {

    const methods = useForm();

    const {control, handleSubmit} = useForm();
    
    const [disabled, setDisabled] = useState<boolean>(false);


    return (
        <Card elevation={1} sx={{background: 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)', marginBottom: '10px'}}>
            <Typography variant="h6" margin="5% 6% 20px 6%" sx={{color: 'white', fontFamily:'Open Sans', fontWeight:'700', fontSize:'22px'}}>New Task</Typography>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit((data) => console.log(data))}>
                    <Grid container margin='10px' columns={24}>
                        <Grid item xs={21}>
                            <WhiteTransparentTextField control={control} label="Task Name" name="taskName"/>
                            <WhiteTransparentTextField control={control} label="Description" name="taskDescription" lines={3}/>
                            <WhiteTransparentAutoComplete control={control} label="Tags" placeholder="Add tags" name="taskTags" />
                            <WhiteTransparentAutoComplete control={control} label="Links" placeholder="Add links" name="taskLinks" />
                            <Grid container alignItems="center"
                                    justifyContent="center" sx={{marginBottom: '10px'}}>
                                <Grid item xs={2}>
                                    <Switch color="default" defaultChecked={false} onClick={() => setDisabled(!disabled)} />
                                </Grid>
                                <Grid item xs={10}>
                                    <WhiteTransparentDatePicker disabled={!disabled} control={control} name="Due Date" />
                                </Grid>
                            </Grid>
                            <Box width='90%' flexGrow={1} margin='auto'>
                            <Typography variant="caption" sx={{color: 'white'}}>Estimated effort</Typography>
                            <Slider
                                    aria-label="Temperature"
                                    defaultValue={5}
                                    valueLabelDisplay="auto"
                                    step={1}
                                    marks
                                    min={1}
                                    max={10}
                                    color="secondary"
                                    sx={{paddingLeft: '5px'}}
                                />   
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