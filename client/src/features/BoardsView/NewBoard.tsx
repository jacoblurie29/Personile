import { Backdrop, Box, Card, CircularProgress, createTheme, Divider, Grid, IconButton, Switch, TextField, ThemeProvider, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useAppDispatch } from "app/store/configureStore";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useHistory } from "react-router-dom";
import NewBoardTextField from "./NewBoardTextField";
import NewBoardAttributeTextField from "./NewBoardAttributeTextField";
import NewBoardDatePicker from "./NewBoardDatePicker";
const theme = createTheme();

export default function NewBoard() {

    const history = useHistory();
    const dispatch = useAppDispatch();
    const {register, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm({
        mode: 'onSubmit'
    });

    const [open, setOpen] = useState(true);
    const [newGoals, setNewGoals] = useState<string[]>([]);
    const [newMilestones, setNewMilestones] = useState<string[]>([]);
    const [newMilestoneDates, setNewMilestoneDates] = useState<string[]>([]);
    const [enableMilestoneDates, setEnableMilestoneDates] = useState<boolean[]>([]);

    const handleClose = () => {
      setOpen(false);
    };

    const handleAddGoalField = () => {
      var oldArray = [...newGoals];
      oldArray.push('')
      setNewGoals(oldArray);
      console.log(oldArray);
    }

    const handleDeleteGoal = (index: number) => {
      var oldArray = [...newGoals];
      oldArray.splice(index, 1)
      setNewGoals(oldArray);
      console.log(oldArray);
    }

    const handleChangeGoal = (index: number, value: string) => {
      var oldArray = [...newGoals];
      oldArray[index] = value;
      setNewGoals(oldArray);
      console.log(oldArray);
    }

    const handleAddMilestoneField = () => {
      var oldMilestoneArray = [...newMilestones];
      oldMilestoneArray.push('')
      setNewMilestones(oldMilestoneArray);

      var oldMilestoneDatesArray = [...newMilestoneDates];
      oldMilestoneDatesArray.push('')
      setNewMilestoneDates(oldMilestoneDatesArray);
      console.log(oldMilestoneDatesArray);

      var oldMilestoneEnabledArray = [...enableMilestoneDates];
      oldMilestoneEnabledArray.push(false)
      setEnableMilestoneDates(oldMilestoneEnabledArray);
      console.log(oldMilestoneEnabledArray);
    }

    const handleDeleteMilestone = (index: number) => {
      var oldArray = [...newMilestones];
      oldArray.splice(index, 1)
      setNewMilestones(oldArray);
      console.log(oldArray);
    }

    const handleChangeMilestone = (index: number, value: string) => {
      var oldArray = [...newMilestones];
      oldArray[index] = value;
      setNewMilestones(oldArray);
      console.log(oldArray);
    }

    const handleDeleteMilestoneDate = (index: number) => {
      var oldMilestoneDateArray = [...newMilestoneDates];
      oldMilestoneDateArray.splice(index, 1)
      setNewMilestoneDates(oldMilestoneDateArray);
      console.log(oldMilestoneDateArray);

      var oldEnableMilestoneDateArray = [...enableMilestoneDates];
      oldEnableMilestoneDateArray.splice(index, 1);
      setEnableMilestoneDates(oldEnableMilestoneDateArray);
      console.log(oldEnableMilestoneDateArray);
    }

    const handleChangeMilestoneDate = (index: number, value: string) => {
      var oldArray = [...newMilestoneDates];
      oldArray[index] = value;
      setNewMilestoneDates(oldArray);
      console.log(oldArray);
    }

    const handleChangeEnableMilestoneDate = (index: number) => {
      var oldArray = [...enableMilestoneDates];
      oldArray[index] = !oldArray[index];
      setEnableMilestoneDates(oldArray);
      console.log(oldArray);
    }



    return (

        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, overflow: 'scroll', overflowX: 'hidden' }}
        open={open}
        >
          <Card sx={{width: '60%'}}>
              <Typography variant="h2" margin='20px 20px 10px 20px'>New Board</Typography>
              <Divider />
              <Grid container columns={12} direction='row' alignItems='center'>
                <Grid item xs={12} padding='10px 20px 0px 20px'>
                    <Typography variant="caption">Board information:</Typography>
                    <NewBoardTextField required={true} id="name" label="Name" name="name" register={register} errors={errors} />
                </Grid>
                <Grid item xs={12} padding='0px 20px 10px 20px'>
                    <NewBoardTextField required={true} id="description" label="Description" name="description" register={register} rows={4} errors={errors} />
                </Grid>
                </Grid>
                <Divider />
                <Grid container columns={12} direction='row' alignItems='center'>
                  <Grid item xs={12} padding='10px 20px 10px 20px'>
                  <Typography variant="caption">Goals &#40;{newGoals.length}&#41;:</Typography>
                    {newGoals.map((newGoal, index) => (
                          <Grid container columns={20} alignItems='center' key={index} padding='2px 10px 2px 10px' marginTop='15px' sx={{backgroundColor: 'primary.light', borderRadius: '5px'}}>
                              <Grid item xs={18} paddingTop='10px' paddingBottom='10px'>
                                <NewBoardAttributeTextField value={newGoals[index]} id={"goal" + index} label={"Goal #" + (index + 1)} name={'goal' + index} index={index} onChange={handleChangeGoal} />
                              </Grid>
                              <Grid item xs={2}>
                                <IconButton sx={{margin: 'auto', padding: '5px',marginLeft:'6px', backgroundColor: 'background.paper'}} size="small" onClick={() => handleDeleteGoal(index)}><ClearIcon sx={{fontSize: '20px'}} /></IconButton>
                              </Grid>
                          </Grid>
                      ))}
                      <Box sx={{ marginRight: '5px', textAlign:'center'}} flexGrow={1} >
                        <IconButton sx={{margin: 'auto', padding: '1px'}} onClick={(event) => {handleAddGoalField()}}><AddCircleIcon sx={{fontSize: '20px'}} /></IconButton>   
                      </Box>
                  </Grid>
                </Grid>
                <Divider />
                <Grid container columns={12} direction='row' alignItems='center'>
                <Grid item xs={12} padding='10px 20px 10px 20px'>
                <Typography variant="caption">Milestones &#40;{newGoals.length}&#41;:</Typography>
                  {newMilestones.map((newGoal, index) => (
                        <Grid key={"milestone-" + index} container columns={20} marginTop='15px' padding='2px 10px 2px 10px' sx={{backgroundColor: 'primary.light', borderRadius: '5px'}}>
                          <Grid item xs={18}>
                            <Grid container columns={20} alignItems='center' key={index}>
                              <Grid item xs={20} paddingTop='10px' paddingBottom='10px'>
                                <NewBoardAttributeTextField value={newMilestones[index]} id={"milestone" + index} label={"Milestone #" + (index + 1)} name={'milestone' + index} index={index} onChange={handleChangeMilestone} />
                              </Grid>
                              <Grid item xs={2} textAlign='left'>
                                  <Switch sx={{color: 'primary.light'}} onChange={() => handleChangeEnableMilestoneDate(index)} />
                              </Grid>
                              <Grid item xs={10} paddingTop='10px' paddingBottom='10px'>
                                <NewBoardDatePicker disabled={!enableMilestoneDates[index]} id={"date" + index} label={"Due Date"} name={"date" + index} value={newMilestoneDates[index]} index={index} onChange={handleChangeMilestoneDate} register={register} errors={errors} />
                              </Grid>
                              <Grid item xs={4} paddingTop='10px' paddingBottom='10px' paddingLeft='20px'>
                                  <Typography variant="h6" textAlign='center'>Is this is a hard deadline?</Typography>
                              </Grid>
                              <Grid item xs ={4} justifyContent='center' alignContent='center'>
                              <ToggleButtonGroup
                                  color="primary"
                                  exclusive
                                  sx={{backgroundColor: 'background.paper'}}>
                                  <ToggleButton value="Yes">Yes</ToggleButton>
                                  <ToggleButton value="No">No</ToggleButton>
                                </ToggleButtonGroup>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item xs={2} margin='auto'>
                              <Box flexGrow={1} textAlign="center">
                                <IconButton sx={{backgroundColor: 'background.paper'}} size="small" onClick={() => {handleDeleteMilestone(index); handleDeleteMilestoneDate(index);}}><ClearIcon sx={{fontSize: '20px'}} /></IconButton>
                              </Box>
                          </Grid>
                        </Grid>
                    ))}
                    <Box sx={{ marginRight: '5px', textAlign:'center'}} flexGrow={1} >
                      <IconButton sx={{margin: 'auto', padding: '1px'}} onClick={(event) => {handleAddMilestoneField()}}><AddCircleIcon sx={{fontSize: '20px'}} /></IconButton>   
                    </Box>
                </Grid>
              </Grid>
              <Divider />
          </Card>
      </Backdrop>
    )
}