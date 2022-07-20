import { Backdrop, Box, Button, Card, Divider, Grid, Grow, IconButton, MenuItem, Select, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useHistory } from "react-router-dom";
import NewBoardTextField from "./NewBoardTextField";
import NewBoardAttributeTextField from "./NewBoardAttributeTextField";
import NewBoardDatePicker from "./NewBoardDatePicker";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import { addBoard } from "app/state/userSlice";
import { Milestone } from "app/models/milestone";
import { Goal } from "app/models/goal";
import Checkbox from '@mui/material/Checkbox';
import { formatDateString } from "app/util/dateUtil";


interface Props {
  setNewBoardState: (state: boolean) => void
}

export default function NewBoard(props: Props) {

    const history = useHistory();
    const userId = useAppSelector(state => state.user.userData?.userEntityId);
    const dispatch = useAppDispatch();
    const {register, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm({
        mode: 'onSubmit'
    });

    // FORM CONSTANTS
    const [open, setOpen] = useState(true);
    const [currentName, setCurrentName] = useState<string>();
    const [currentDescription, setCurrentDecription] = useState<string>();
    const [endDateEnabled, setEndDateEnabled] = useState(false);
    const [newGoals, setNewGoals] = useState<string[]>([]);
    const [newMilestones, setNewMilestones] = useState<string[]>([]);
    const [newMilestoneDates, setNewMilestoneDates] = useState<string[]>([]);
    const [enableMilestoneDates, setEnableMilestoneDates] = useState<boolean[]>([]);
    const [newMilestoneHardDeadline, setNewMilestoneHardDeadline] = useState<boolean[]>([]);
    const [boardEndDate, setBoardEndDate] = useState<string[]>([new Date().toString()]);
    const [currentScreen, setCurrentScreen] = useState<number>(1);
    const [customLengthChecked, setCustomLengthChecked] = useState<boolean>(false);
    const [currentCustomSprintLength, setCurrentCustomSprintLength] = useState<number | undefined>(undefined);

    const [firstScreenAnimation, setFirstScreenAnimation] = useState<boolean>(true);
    const [secondScreenAnimation, setSecondScreenAnimation] = useState<boolean>(true);
    

    const handleClose = () => {
      setOpen(false);
    };

    const handleAddGoalField = () => {
      if(newGoals[newGoals.length - 1] !== "") {
        var oldArray = [...newGoals];
        oldArray.push('')
        setNewGoals(oldArray);
      }
    }

    const handleDeleteGoal = (index: number) => {
      var oldArray = [...newGoals];
      oldArray.splice(index, 1)
      setNewGoals(oldArray);
    }

    const handleChangeGoal = (index: number, value: string) => {
      var oldArray = [...newGoals];
      oldArray[index] = value;
      setNewGoals(oldArray);
    }

    const handleAddMilestoneField = () => {
      if(newMilestones[newMilestones.length - 1] !== "") {
        var oldMilestoneArray = [...newMilestones];
        oldMilestoneArray.push('')
        setNewMilestones(oldMilestoneArray);

        var oldMilestoneDatesArray = [...newMilestoneDates];
        oldMilestoneDatesArray.push('')
        setNewMilestoneDates(oldMilestoneDatesArray);

        var oldMilestoneEnabledArray = [...enableMilestoneDates];
        oldMilestoneEnabledArray.push(false)
        setEnableMilestoneDates(oldMilestoneEnabledArray);

        var oldHardDeadlineArray = [...newMilestoneHardDeadline];
        oldHardDeadlineArray.push(false);
        setNewMilestoneHardDeadline(oldHardDeadlineArray);
      }
    }

    const handleDeleteMilestone = (index: number) => {
      var oldArray = [...newMilestones];
      oldArray.splice(index, 1)
      setNewMilestones(oldArray);
    }

    const handleChangeMilestone = (index: number, value: string) => {
      var oldArray = [...newMilestones];
      oldArray[index] = value;
      setNewMilestones(oldArray);
    }

    const handleDeleteMilestoneDate = (index: number) => {
      var oldMilestoneDateArray = [...newMilestoneDates];
      oldMilestoneDateArray.splice(index, 1)
      setNewMilestoneDates(oldMilestoneDateArray);

      var oldEnableMilestoneDateArray = [...enableMilestoneDates];
      oldEnableMilestoneDateArray.splice(index, 1);
      setEnableMilestoneDates(oldEnableMilestoneDateArray);

      var oldHardDeadlineArray = [...newMilestoneHardDeadline];
      oldHardDeadlineArray.splice(index, 1);
      setNewMilestoneHardDeadline(oldHardDeadlineArray);
    }

    const handleChangeMilestoneDate = (index: number, value: string) => {
      var oldArray = [...newMilestoneDates];
      oldArray[index] = value;
      setNewMilestoneDates(oldArray);
    }

    const handleChangeEnableMilestoneDate = (index: number) => {
      var oldArray = [...enableMilestoneDates];
      oldArray[index] = !oldArray[index];
      setEnableMilestoneDates(oldArray);
    }

    const handleChangeHardDeadline = (index: number, value: boolean) => {
      var oldArray = [...newMilestoneHardDeadline];
      oldArray[index] = value;
      setNewMilestoneHardDeadline(oldArray);
    }

    const handleChangeBoardEndDate = (index: number, value: string) => {
      var oldArray = [...boardEndDate];
      oldArray[index] = value;
      setBoardEndDate(oldArray);
    }

    

    async function submitForm(data: FieldValues) {
      // console.log(data);
      // console.log("GOALS: " + newGoals);
      // console.log("MILESTONES: " + newMilestones);
      // console.log("MILESTONE DATES: " + newMilestoneDates);
      // console.log("MILESTONE ENABLED: " + enableMilestoneDates);
      // console.log("HARD DEADLINE: " + newMilestoneHardDeadline);
      // console.log("BOARD END DATE: " + boardEndDate[0]);

      /* HERE: Create milestone and goal objects then attach to new board objects and send over the wire */

      if(userId == null) return;


      var goalArray: Goal[] = [];
      var milestoneArray: Milestone[] = [];

      newGoals.forEach(goal => {
        if(goal !== "") {
          goalArray.push( {
              goalEntityId: uuidv4(),
              details: goal,
              status: 'Incomplete'
            }
          )
        }
      });

      newMilestones.forEach((milestone, index) => {
          if(milestone !== "")  {
            milestoneArray.push( {
              milestoneEntityId: uuidv4(),
              description: newMilestones[index],
              status: "Incomplete",
              dueDate: enableMilestoneDates[index] ? newMilestoneDates[index].toString() === "" ? new Date().toString() : newMilestoneDates[index].toString() : "",
              hardDeadline: newMilestoneHardDeadline[index],
              associatedTaskIds: "",
              completedDate: ""
            }
          )
        }
      })

      if (currentName === undefined || currentDescription === undefined) return;

      var newBoard = {
        boardEntityId: uuidv4(),
        name: currentName,
        description: currentDescription,
        sprintDaysLength: 14,
        handleOverflow: "",
        startDate: new Date().toString(),
        endDate: endDateEnabled ? boardEndDate.toString() === "" ? new Date().toString() : boardEndDate.toString() : "",
        sprints: [],
        goals: goalArray,
        milestones: milestoneArray
      }

      /* TODO: PASS THIS TO FOLLOWING COMPONENT, USE START/END DATE FOR CALCULATION  */

      console.log(newBoard)

      props.setNewBoardState(false);

      dispatch(addBoard({userId: userId, board: newBoard})).catch(error => console.log(error));
    }

    async function handleNextScreen(data: FieldValues) {

        setCurrentName(data.name);
        setCurrentDecription(data.description);
        setFirstScreenAnimation(false)
        setSecondScreenAnimation(true);
        await new Promise<void>(done => setTimeout(() => done(), 400));
        setCurrentScreen(2);

    }

    async function handleGoBack() {

      setSecondScreenAnimation(false);
      setFirstScreenAnimation(true)
      await new Promise<void>(done => setTimeout(() => done(), 400));
      setCurrentScreen(1);

    }

    const calculateSprintShortLength = (totalLength: number) => {

      if(totalLength === 0) return 7;

      var estimation = (Math.log(totalLength) * 2.985) - 6.5728;

      return Math.round(estimation);
    }

    const calculateSprintRecommendedLength = (totalLength: number) => {

      if(totalLength === 0) return 14;

      var estimation = (Math.log(totalLength) * 6.972) - 16.524;

      return Math.round(estimation);
    }

    const calculateSprintLongLength = (totalLength: number) => {

      if(totalLength === 0) return 30;

      var estimation = (Math.log(totalLength) * 14.331) - 33.6;

      return Math.round(estimation);
    }

    const calculateTotalLength = (endDate: string) => {

      var milliseconds = Date.parse(endDate) - Date.parse(new Date().toString());

      var days, total_hours, total_minutes, total_seconds;
  
      total_seconds = Math.floor(milliseconds / 1000);
      total_minutes = Math.floor(total_seconds / 60);
      total_hours = Math.floor(total_minutes / 60);
      days = Math.floor(total_hours / 24);

      return Math.round(days) + 1;

    }

    const calculateNumberOfSprints= (totalDays: number, sprintLength: number) => {
      
      if(totalDays % sprintLength > Math.floor(sprintLength / 2)) {
        return Math.ceil(totalDays / sprintLength)
      } else {
        return Math.floor(totalDays / sprintLength)
      }
      

    }


    return (

        <Backdrop
        sx={{ color: '#fff', overflow: 'scroll', overflowX: 'hidden', padding: '80px' }}
        open={open}
        >
          {currentScreen === 1 &&
          <Grow in={firstScreenAnimation}>
              <Card sx={{width: '60%', maxWidth: '800px', margin: 'auto'}}>
                <Box component="form" noValidate onSubmit={handleSubmit(handleNextScreen)} sx={{ mt: 1 }}>
                    <Typography variant="h2" margin='20px 20px 10px 20px'>New Board</Typography>
                    <Divider />
                    <Grid container columns={12} direction='row' alignItems='center'>
                      <Grid item xs={12} padding='10px 20px 0px 20px'>
                          <Typography variant="caption">Board information:</Typography>
                          <NewBoardTextField required={true} id="name" label="Name" name="name" register={register} autoFocus={true} error={!!errors.name} helperText={errors?.name?.message?.toString()} />
                      </Grid>
                      <Grid item xs={12} padding='0px 20px 10px 20px'>
                          <NewBoardTextField required={true} id="description" label="Description" name="description" autoFocus={false} register={register} rows={4} error={!!errors.description} helperText={errors?.description?.message?.toString()} />
                      </Grid>
                      <Grid item xs={12} padding='0px 20px 10px 20px'>
                        <Grid container  alignItems='center'>
                          <Grid item xs={1} textAlign='left'>
                              <Switch sx={{color: 'primary.light'}} checked={endDateEnabled} onChange={(event, checked) => setEndDateEnabled(checked)} />
                          </Grid>
                          <Grid item xs={11} paddingTop='10px' paddingBottom='10px'>
                            <NewBoardDatePicker disabled={!endDateEnabled} id={"boardEndDate"} label={"Board End Date"} name={"boardEndDate"} value={boardEndDate[0]} index={0} onChange={handleChangeBoardEndDate} />
                          </Grid>
                        </Grid>
                      </Grid>
                      </Grid>
                      <Divider />
                      <Grid container columns={12} direction='row' alignItems='center'>
                        <Grid item xs={12} padding='10px 20px 10px 20px'>
                        <Typography variant="caption">Goals &#40;{newGoals.length}&#41;:</Typography>
                          {newGoals.map((newGoal, index) => (
                              <Grow in={true} key={"goalGrow-" + index}>
                                <Grid container columns={20} alignItems='center' key={index} padding='2px 10px 2px 10px' marginTop='15px' sx={{backgroundColor: 'primary.light', borderRadius: '5px'}}>
                                    <Grid item xs={18} paddingTop='10px' paddingBottom='10px'>
                                      <NewBoardAttributeTextField value={newGoals[index]} id={"goal" + index} label={"Goal #" + (index + 1)} name={'goal' + index} index={index} onChange={handleChangeGoal} error={!!errors['goal' + index]} helperText={errors['goal' + index]?.message?.toString()} />
                                    </Grid>
                                    <Grid item xs={2}>
                                      <IconButton sx={{margin: 'auto', padding: '5px',marginLeft:'6px', backgroundColor: 'background.paper'}} size="small" onClick={() => handleDeleteGoal(index)}><ClearIcon sx={{fontSize: '20px'}} /></IconButton>
                                    </Grid>
                                </Grid>
                              </Grow>
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
                          <Grow in={true} key={"milestoneGrow-" + index}>
                              <Grid key={"milestone-" + index} container columns={20} marginTop='15px' padding='2px 10px 2px 10px' sx={{backgroundColor: 'primary.light', borderRadius: '5px'}}>
                                <Grid item xs={18}>
                                  <Grid container columns={20} alignItems='center' key={index}>
                                    <Grid item xs={20} paddingTop='10px' paddingBottom='10px'>
                                      <NewBoardAttributeTextField value={newMilestones[index]} id={"milestone" + index} label={"Milestone #" + (index + 1)} name={'milestone' + index} index={index} onChange={handleChangeMilestone}/>
                                    </Grid>
                                    <Grid item xs={2} textAlign='left'>
                                        <Switch sx={{color: 'primary.light'}} checked={enableMilestoneDates[index]} onChange={() => handleChangeEnableMilestoneDate(index)} />
                                    </Grid>
                                    <Grid item xs={10} paddingTop='10px' paddingBottom='10px'>
                                      <NewBoardDatePicker disabled={!enableMilestoneDates[index]} id={"date" + index} label={newMilestoneHardDeadline[index] ? "Deadline" : "Goal"} name={"date" + index} value={newMilestoneDates[index]} index={index} onChange={handleChangeMilestoneDate} />
                                    </Grid>
                                    <Grid item xs={4} paddingTop='10px' paddingBottom='10px' paddingLeft='20px'>
                                        <Typography variant="h6" textAlign='center' color={enableMilestoneDates[index] ? 'grey.900' : 'grey.400'}>Is this is a hard deadline?</Typography>
                                    </Grid>
                                    <Grid item xs ={4} justifyContent='center' alignContent='center'>
                                    <ToggleButtonGroup
                                        disabled={!enableMilestoneDates[index]}
                                        color="primary"
                                        exclusive
                                        sx={{backgroundColor: 'background.paper'}}>
                                        <ToggleButton selected={enableMilestoneDates[index] && newMilestoneHardDeadline[index] == true} onClick={() => handleChangeHardDeadline(index, true)} value="Yes">Yes</ToggleButton>
                                        <ToggleButton selected={enableMilestoneDates[index] && newMilestoneHardDeadline[index] == false} onClick={() => handleChangeHardDeadline(index, false)} value="No">No</ToggleButton>
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
                              </Grow>
                          ))}
                          <Box sx={{ marginRight: '5px', textAlign:'center'}} flexGrow={1} >
                            <IconButton sx={{margin: 'auto', padding: '1px'}} onClick={(event) => {handleAddMilestoneField()}}><AddCircleIcon sx={{fontSize: '20px'}} /></IconButton>   
                          </Box>
                      </Grid>
                    </Grid>
                    <Divider />
                    <Box sx={{flexGrow: 1, textAlign: 'right', marginRight: '5px', marginTop: '5px', padding: '10px'}}>
                          <LoadingButton key={"cancel"} variant='contained' sx={{background: 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)', borderRadius:"5px", mr:"10px"}} onClick={() => props.setNewBoardState(false)}><DeleteIcon sx={{color: 'background.paper'}} /></LoadingButton>
                          <LoadingButton type="submit" key={"next"} variant='contained' sx={{borderRadius:"5px", background:'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)'}} onClick={() => console.log(errors)}>NEXT</LoadingButton>
                    </Box>
                </Box>
              </Card>
          </Grow>
        }
        {currentScreen === 2 && 
          <Grow in={secondScreenAnimation}>
              <Card sx={{width: '60%', maxWidth: '800px'}}>
                <Box component="form" noValidate onSubmit={handleSubmit(submitForm)} sx={{ mt: 1 }}>
                    <Grid container>
                       <Grid item xs={6}>
                          <Typography variant="h2" margin='20px 20px 10px 20px'>Select Sprint Length</Typography>
                       </Grid>
                       <Grid item xs={6} sx={{textAlign: 'right'}}>
                          <Typography variant="h5" margin='20px 20px 10px 20px'>{calculateTotalLength(boardEndDate[0]) !== 0 && formatDateString(new Date().toString()) + " to " + formatDateString(boardEndDate[0])}<b>&nbsp;&nbsp;{calculateTotalLength(boardEndDate[0]) !== 0 ? ("(" + calculateTotalLength(boardEndDate[0]) + " days)") : "No end date"}</b></Typography>
                       </Grid>
                    </Grid>
                    <Divider />
                    <Grid container padding='20px' flexGrow={1} columns={25} justifyContent='center'>
                      <Grid item xs={7} sx={{textAlign: 'left', margin: '20px 6px 6px 6px'}}>
                        <Card sx={{textAlign: 'center'}} elevation={3}>
                          <Typography variant="h4" sx={{margin: '8px 8px 2px 8px'}}>Shorter</Typography>
                          <Divider />
                          <Box paddingLeft='5px'>
                            <Typography sx={{margin: '4px 4px 0px 4px', fontSize: '60px', display: 'inline-block'}}>{calculateSprintShortLength(calculateTotalLength(boardEndDate[0]))}</Typography>
                            <Typography variant="h3" sx={{margin: '4px', display: 'inline-block'}}>Days</Typography>
                          </Box>
                          <Typography variant="h5" sx={{margin: '0px 4px 4px 4px'}}>{calculateTotalLength(boardEndDate[0]) / calculateSprintShortLength(calculateTotalLength(boardEndDate[0])) !== 0 ? ("(" + calculateNumberOfSprints(calculateTotalLength(boardEndDate[0]), calculateSprintShortLength(calculateTotalLength(boardEndDate[0]))) + " Sprints)") : "" }</Typography>
                          <Divider />
                          <Typography variant='subtitle2' padding='5px'>Divide your board into smaller sections. Great for boards with smaller tasks.</Typography>
                          <Button fullWidth sx={{backgroundColor: customLengthChecked ? 'grey.400' : 'primary.main', borderRadius: '0px 0px 5px 5px', ':hover': { backgroundColor: 'primary.dark'}}} disabled={customLengthChecked}>
                              <Typography variant='h6' sx={{color: 'background.paper'}}>Select</Typography>
                          </Button>
                        </Card>
                      </Grid>
                      <Grid item xs={9} sx={{textAlign: 'left', margin: '10px 6px 6px 6px'}}>
                        <Card sx={{textAlign: 'center'}} elevation={3}>
                          <Typography variant="h4" sx={{margin: '8px 8px 2px 8px'}}>Recommended</Typography>
                          <Divider />
                          <Box paddingLeft='5px'>
                            <Typography sx={{margin: '4px 4px 0px 4px', fontSize: '90px', display: 'inline-block'}}>{calculateSprintRecommendedLength(calculateTotalLength(boardEndDate[0]))}</Typography>
                            <Typography variant="h3" sx={{margin: '0px 4px 4px 4px', display: 'inline-block'}}>Days</Typography>
                          </Box>
                            <Typography variant="h5" sx={{margin: '0px 4px 4px 4px'}}>{calculateTotalLength(boardEndDate[0]) / calculateSprintShortLength(calculateTotalLength(boardEndDate[0])) !== 0 ? ("(" + calculateNumberOfSprints(calculateTotalLength(boardEndDate[0]), calculateSprintRecommendedLength(calculateTotalLength(boardEndDate[0]))) + " Sprints)") : "" }</Typography>
                          <Divider />
                          <Typography variant='subtitle2' padding='5px'>Not sure where to start? We've got you covered. Our algorithm reccomends you start here!</Typography>
                          <Button fullWidth sx={{backgroundColor: customLengthChecked ? 'grey.400' : 'primary.main', borderRadius: '0px 0px 5px 5px', ':hover': { backgroundColor: 'primary.dark'}}} disabled={customLengthChecked}>
                              <Typography variant='h6' sx={{color: 'background.paper'}}>Select</Typography>
                          </Button>
                        </Card>
                      </Grid>
                      <Grid item xs={7} sx={{textAlign: 'left', margin: '20px 6px 0px 6px'}}>
                        <Card sx={{textAlign: 'center'}}  elevation={3}>
                          <Typography variant="h4" sx={{margin: '8px 8px 2px 8px'}}>Longer</Typography>
                          <Divider />
                          <Box paddingLeft='5px'>
                            <Typography sx={{margin: '4px 4px 0px 4px', fontSize: '60px', display: 'inline-block'}}>{calculateSprintLongLength(calculateTotalLength(boardEndDate[0]))}</Typography>
                            <Typography variant="h3" sx={{margin: '4px', display: 'inline-block'}}>Days</Typography>
                          </Box>
                          <Typography variant="h5" sx={{margin: '0px 4px 4px 4px'}}>{calculateTotalLength(boardEndDate[0]) / calculateSprintShortLength(calculateTotalLength(boardEndDate[0])) !== 0 ? ("(" + calculateNumberOfSprints(calculateTotalLength(boardEndDate[0]), calculateSprintLongLength(calculateTotalLength(boardEndDate[0]))) + " Sprints)") : "" }</Typography>
                          <Divider />
                          <Typography variant='subtitle2' padding='5px'>Divide your board into longer sections. Better for boards with broader tasks</Typography>
                          <Button fullWidth sx={{backgroundColor: customLengthChecked ? 'grey.400' : 'primary.main', borderRadius: '0px 0px 5px 5px', ':hover': { backgroundColor: 'primary.dark'}}} disabled={customLengthChecked}>
                              <Typography variant='h6' sx={{color: 'background.paper'}}>Select</Typography>
                          </Button>
                        </Card>
                      </Grid>
                    </Grid>
                <Divider />
                <Box padding='20px'>
                  <Typography variant="caption">Options</Typography>
                  <Grid container justifyContent='center' alignItems='center'>
                      <Grid item xs={6} textAlign='center' >
                        <Box>
                          <Typography component='span' variant='h5'>Handle overflow:&nbsp;&nbsp;</Typography>
                          <Select defaultValue={'even'} size='small'>
                            <MenuItem value={'even'}>Evenly Distribute</MenuItem>
                            <MenuItem value={'start'}>Attach to start</MenuItem>
                            <MenuItem value={'end'}>Attach to end</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                      <Grid item xs={6} textAlign='center' >
                        <Box>
                          
                          <Grid container width='fit-content'>
                            <Grid item xs = {1} marginTop='auto' marginBottom='auto'>
                              <Checkbox sx={{color: 'grey.600', marginRight: '10px'}} value={customLengthChecked} onChange={(event, checked) => setCustomLengthChecked(checked)} />
                            </Grid>
                            <Grid item xs={4} textAlign='right' marginTop='auto' marginBottom='auto' alignItems='center'>
                              <Typography sx={{color: customLengthChecked ? 'grey.800' : 'grey.400'}} component='span' variant='h5'>Custom length:&nbsp;&nbsp;</Typography>
                            </Grid> 
                            <Grid item xs={6} marginTop='auto' marginBottom='auto'>
                              <TextField value={customLengthChecked ? currentCustomSprintLength : ""} onChange={(event) => {event.target.value == "" ? setCurrentCustomSprintLength(undefined) : parseInt(event.target.value) > 0 && setCurrentCustomSprintLength(parseInt(event.target.value))}} size='small' disabled={!customLengthChecked} placeholder="Days" type='number' helperText={currentCustomSprintLength !== undefined && currentCustomSprintLength > 0 && customLengthChecked ? (calculateNumberOfSprints(calculateTotalLength(boardEndDate[0]), currentCustomSprintLength) + " Sprints") : ""}/>   
                            </Grid>
                          </Grid>
                        </Box>                      
                      </Grid>
                  </Grid>
                </Box>
                <Divider />
                <Box>
                  <Grid container>
                      <Grid item xs={2}>
                        <Box sx={{flexGrow: 1, textAlign: 'left', marginRight: '5px', marginTop: '5px', padding: '10px'}}>
                          <Button key={"back"} variant='contained' sx={{margin: 'auto', background: "linear-gradient(232deg, rgba(173,173,173,1) 0%, rgba(158,158,158,1) 100%)", borderRadius:"5px", mr:"10px"}} onClick={() => handleGoBack()}>GO BACK</Button>
                        </Box>
                      </Grid>
                      <Grid item xs={8}>
                        
                      </Grid>
                      <Grid item xs={2}>
                        <Box sx={{flexGrow: 1, textAlign: 'right', padding: '10px'}}>
                          <LoadingButton type="submit" key={"submit"} variant='contained' sx={{margin: 'auto', borderRadius:"5px", background:'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)'}} onClick={() => console.log(errors)}>CREATE</LoadingButton>
                        </Box>
                      </Grid>
                  </Grid>
                </Box>
                </Box>
              </Card>
          </Grow>
        }
      </Backdrop>
    )
}