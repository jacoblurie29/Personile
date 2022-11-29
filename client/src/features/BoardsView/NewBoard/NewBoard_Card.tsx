import { Backdrop, Box, Button, Card, Divider, Grid, Grow, IconButton, MenuItem, Select, Switch, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import { useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import ClearIcon from '@mui/icons-material/Clear';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useHistory } from "react-router-dom";
import NewBoardTextField from "./NewBoard_TextField";
import NewBoardAttributeTextField from "./NewBoard_AttributeTextField";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from '@mui/icons-material/Delete';
import { v4 as uuidv4 } from 'uuid';
import { addBoardAsync, deleteBoardAsync, updateBoardAsync } from "app/state/userSlice";
import { Milestone } from "app/models/milestone";
import { Goal } from "app/models/goal";
import Checkbox from '@mui/material/Checkbox';
import { formatDateString } from "app/util/dateUtil";
import { Board } from "app/models/board";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NewBoardDatePicker from "./NewBoard_DatePicker";
import SprintVisualizer from "./NewBoard_SprintVisualizer";
import { ActivityEvent } from "app/models/activityEvent";


interface Props {
  setNewBoardState: (state: boolean, editBoard?: Board) => void,
  editBoard?: Board,
}

export default function NewBoardCard(props: Props) {

    // redux state
    const history = useHistory();
    const userId = useAppSelector(state => state.user.userData?.userEntityId);
    const userName = useAppSelector(state => state.user.userData?.firstName + " " + state.user.userData?.lastName);
    const dispatch = useAppDispatch();

    // react hook form
    const {register, handleSubmit, setValue, formState: {isSubmitting, errors, isValid}} = useForm({
        mode: 'onSubmit'
    });

    // react state
    const [open, setOpen] = useState(true);
    const [currentName, setCurrentName] = useState<string>(props.editBoard?.name || "");
    const [currentDescription, setCurrentDecription] = useState<string>(props.editBoard?.description || "");
    const [endDateEnabled, setEndDateEnabled] = useState<boolean>(props.editBoard?.endDate !== "" && props.editBoard !== undefined || false);
    const [newGoals, setNewGoals] = useState<string[]>(props.editBoard?.goals.map(g => g.details) || []);
    const [newMilestones, setNewMilestones] = useState<string[]>(props.editBoard?.milestones.map(m => m.description) || []);
    const [newMilestoneDates, setNewMilestoneDates] = useState<string[]>(props.editBoard?.milestones.map(m => m.dueDate) || []);
    const [enableMilestoneDates, setEnableMilestoneDates] = useState<boolean[]>(props.editBoard?.milestones.map(m => m.dueDate !== "") || []);
    const [newMilestoneHardDeadline, setNewMilestoneHardDeadline] = useState<boolean[]>(props.editBoard?.milestones.map(m => m.hardDeadline) || []);
    const [boardEndDate, setBoardEndDate] = useState<string[]>(props.editBoard?.endDate !== "" && props.editBoard?.endDate !== undefined ? [props.editBoard?.endDate] : [""]);
    const [currentScreen, setCurrentScreen] = useState<number>(1);
    const [customLengthChecked, setCustomLengthChecked] = useState<boolean>(false);
    const [currentCustomSprintLength, setCurrentCustomSprintLength] = useState<number | undefined>(undefined);
    const [overflow, setOverflow] = useState<string>("start");
    const [sprintOptionSelected, setSprintOptionSelected] = useState<number | undefined>(undefined);
    const [firstScreenAnimation, setFirstScreenAnimation] = useState<boolean>(true);
    const [secondScreenAnimation, setSecondScreenAnimation] = useState<boolean>(true);
    

    // add a new goal field to the interface
    const handleAddGoalField = () => {
      if(newGoals[newGoals.length - 1] !== "") {
        var oldArray = [...newGoals];
        oldArray.push('')
        setNewGoals(oldArray);
      }
    }

    // remove a goal field from the interface
    const handleDeleteGoal = (index: number) => {
      var oldArray = [...newGoals];
      oldArray.splice(index, 1)
      setNewGoals(oldArray);
    }

    // change the value of a goal field
    const handleChangeGoal = (index: number, value: string) => {
      var oldArray = [...newGoals];
      oldArray[index] = value;
      setNewGoals(oldArray);
    }

    // add a new milestone field
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

    // delete a milestone field
    const handleDeleteMilestone = (index: number) => {
      var oldArray = [...newMilestones];
      oldArray.splice(index, 1)
      setNewMilestones(oldArray);
    }

    // change a milestone field value
    const handleChangeMilestone = (index: number, value: string) => {
      var oldArray = [...newMilestones];
      oldArray[index] = value;
      setNewMilestones(oldArray);
    }

    // remove a date from a milestone
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

    // change a date of a milestone
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

    // enable/disable hard deadline option
    const handleChangeHardDeadline = (index: number, value: boolean) => {
      var oldArray = [...newMilestoneHardDeadline];
      oldArray[index] = value;
      setNewMilestoneHardDeadline(oldArray);
    }

    // change board end date value
    const handleChangeBoardEndDate = (index: number, value: string) => {
      var oldArray = [...boardEndDate];
      oldArray[index] = value;
      setBoardEndDate(oldArray);
    }

    // submit data for board creation
    async function submitForm(data: FieldValues) {

      // null checks
      if(userId == null) return;
      if (currentName === undefined || currentDescription === undefined) return;

      // base object arrays for goals and milestones
      var goalArray: Goal[] = [];
      var milestoneArray: Milestone[] = [];

      // map goal data to array
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

      // map milestone data to array
      newMilestones.forEach((milestone, index) => {
          if(milestone !== "")  {
            milestoneArray.push( {
              milestoneEntityId: uuidv4(),
              description: newMilestones[index],
              status: "Incomplete",
              dueDate: (enableMilestoneDates[index] ? newMilestoneDates[index].toString() === "" ? new Date().toUTCString() : newMilestoneDates[index].toString() : "").substring(0, 15),
              hardDeadline: newMilestoneHardDeadline[index],
              associatedTaskIds: "",
              completedDate: "",
              taskIds: [] as string[]
            }
          )
        }
      })


      // new board
      if(props.editBoard == undefined) {

          // calculate length of sprint
          var sprintDaysLength = () => {
              if (customLengthChecked) {
                return currentCustomSprintLength;
              } else {
                switch (sprintOptionSelected) {
                  case 0:
                    return calculateSprintShortLength(calculateTotalLength(boardEndDate[0]));
                    break;
                  case 1:
                    return calculateSprintRecommendedLength(calculateTotalLength(boardEndDate[0]));
                    break;
                  case 2:
                    return calculateSprintLongLength(calculateTotalLength(boardEndDate[0]));
                    break;
                  default:
                    return 14;
                    break;
                }
              }
          }


          // map data to board object
          var newBoard = {
            boardEntityId: uuidv4(),
            name: data.name,
            description: data.description,
            sprintDaysLength: sprintDaysLength() || 14,
            handleOverflow: overflow,
            startDate: new Date().toString(),
            endDate: endDateEnabled ? boardEndDate.toString() === "" ? new Date().toString() : boardEndDate.toString() : "",
            sprints: [],
            goals: goalArray,
            milestones: milestoneArray,
            activityEvents: []
          }

        // close new board window
        props.setNewBoardState(false);

        // submit data for new board creation
        dispatch(addBoardAsync({userId: userId, board: newBoard})).catch(error => console.log(error));

      // edit board
      } else {

        // copy previous state of board
        var prevState = props.editBoard;

        // map form data and past data to future board object for redux
        var futureState = {
            boardEntityId: props.editBoard.boardEntityId,
            name: data.name,
            description: data.description,
            sprintDaysLength: props.editBoard.sprintDaysLength,
            handleOverflow: props.editBoard.handleOverflow,
            startDate: props.editBoard.startDate,
            endDate: props.editBoard.endDate,
            sprints: props.editBoard.sprints,
            goals: goalArray,
            milestones: milestoneArray,
            activityEvents: []
        };

        // map form data for board update
        var editBoard = {
          boardEntityId: props.editBoard.boardEntityId,
          name: data.name,
          description: data.description,
          goals: goalArray,
          milestones: milestoneArray,
          activityEvents: []
        }

        // close edit board window
        props.setNewBoardState(false);

        // submit data for board update
        dispatch(updateBoardAsync({userId: userId, boardId: props.editBoard.boardEntityId, updateBoardDto: editBoard, previousState: prevState, futureState: futureState}))

      }

    }

    // find sprint length
    const findSprintLength = () : number => {

        if (customLengthChecked) {
          return currentCustomSprintLength!;
        } else {
          switch (sprintOptionSelected) {
            case 0:
              return calculateSprintShortLength(calculateTotalLength(boardEndDate[0]));
              break;
            case 1:
              return calculateSprintRecommendedLength(calculateTotalLength(boardEndDate[0]));
              break;
            case 2:
              return calculateSprintLongLength(calculateTotalLength(boardEndDate[0]));
              break;
            default:
              return 14;
              break;
          }
        }
      
    }

    // delete board from user account
    const handleDeleteBoard = (boardId: string) => {

      // null checks
      if(userId == null || boardId == "") return;

      // close edit board window
      props.setNewBoardState(false);

      // delete board from data
      dispatch(deleteBoardAsync({boardId: boardId, userId: userId}));

    }
    
    // move from first to second screen in board creation
    async function handleNextScreen(data: FieldValues) {

        // assign data values from first screen
        setCurrentName(data.name);
        setCurrentDecription(data.description);

        // animate panel
        setFirstScreenAnimation(false)
        setSecondScreenAnimation(true);

        // timeout for looks
        await new Promise<void>(done => setTimeout(() => done(), 400));

        // move to next screen
        setCurrentScreen(2);

    }

    // move from second back to first board screen
    async function handleGoBack() {

      // animate panel
      setSecondScreenAnimation(false);
      setFirstScreenAnimation(true)

      // timeout for looks
      await new Promise<void>(done => setTimeout(() => done(), 400));

      // move to previous screen
      setCurrentScreen(1);

    }

    // use total sprint length to calculate recommended short length
    const calculateSprintShortLength = (totalLength: number) => {

      if(totalLength === 0) return 7;

      var estimation = (Math.log(totalLength) * 2.985) - 6.5728;

      if(Math.round(estimation) < 1) {
        return 1;
      }

      return Math.round(estimation);
    }

    // use total sprint length to calculate recommended mid length
    const calculateSprintRecommendedLength = (totalLength: number) => {

      if(totalLength === 0) return 14;

      var estimation = (Math.log(totalLength) * 6.972) - 16.524;

      if(Math.round(estimation) < 1) {
        return Math.round(totalLength / 3);
      }

      return Math.round(estimation);
    }

    // use total sprint length to calculate recommended long length
    const calculateSprintLongLength = (totalLength: number) => {

      if(totalLength === 0) return 30;

      var estimation = (Math.log(totalLength) * 14.331) - 33.6;

      if(Math.round(estimation) < 1) {
        return Math.round(totalLength / 2);
      }

      return Math.round(estimation);
    }

    // calculate the length of a board in days based on start and end date
    const calculateTotalLength = (endDate: string) => {

      if(endDate == "") {
        return 0;
      }

      var milliseconds = Date.parse(endDate) - Date.parse(new Date().toString());

      var days, total_hours, total_minutes, total_seconds;
  
      total_seconds = Math.floor(milliseconds / 1000);
      total_minutes = Math.floor(total_seconds / 60);
      total_hours = Math.floor(total_minutes / 60);
      days = Math.floor(total_hours / 24);

      return Math.round(days) + 2;

    }

    // calcuate integer number of sprints from board data
    const calculateNumberOfSprints= (totalDays: number, sprintLength: number) => {
      
      if(totalDays % sprintLength > Math.floor(sprintLength / 2)) {
        return Math.ceil(totalDays / sprintLength)
      } else {
        return Math.floor(totalDays / sprintLength)
      }
      

    }

    // set initial values of name and description
    useEffect(() => {
        if(props.editBoard !== undefined) {
          setValue('name', props.editBoard.name);
          setValue('description', props.editBoard.description);
        }
    }, [])


    return (

        <Backdrop
        sx={{ color: '#fff', overflow: 'scroll', overflowX: 'hidden', padding: '80px' }}
        open={open}
        >
          {currentScreen === 1 &&
          <Grow in={firstScreenAnimation}>
              <Card sx={{width: '60%', maxWidth: '800px', margin: 'auto'}}>
                <Box component="form" noValidate onSubmit={props.editBoard == undefined ? handleSubmit(handleNextScreen) : handleSubmit(submitForm)} sx={{ mt: 1 }}>
                    <Typography variant="h2" margin='20px 20px 10px 20px'>{props.editBoard == undefined ? "New Board" : "Edit Board"}</Typography>
                    <Divider />
                    <Grid container columns={12} direction='row' alignItems='center'>
                      <Grid item xs={12} padding='10px 20px 0px 20px'>
                          <Typography variant="caption">Board information:</Typography>
                          <NewBoardTextField value={currentName} required={true} id="name" label="Name" name="name" register={register} autoFocus={true} error={!!errors.name} helperText={errors?.name?.message?.toString()} />
                      </Grid>
                      <Grid item xs={12} padding='0px 20px 10px 20px'>
                          <NewBoardTextField value={currentDescription} required={true} id="description" label="Description" name="description" autoFocus={false} register={register} rows={4} error={!!errors.description} helperText={errors?.description?.message?.toString()} />
                      </Grid>
                      <Grid item xs={12} padding='0px 20px 10px 20px'>
                      {props.editBoard == undefined &&
                        <Grid container  alignItems='center'>
                          <Grid item xs={1} textAlign='left'>
                              <Switch sx={{color: 'primary.light'}} checked={endDateEnabled} onChange={(event, checked) => {setEndDateEnabled(checked); setBoardEndDate([""]);}} />
                          </Grid>
                          <Grid item xs={11} paddingTop='10px' paddingBottom='10px'>
                            <NewBoardDatePicker disabled={!endDateEnabled} id={"boardEndDate"} label={"Board End Date"} name={"boardEndDate"} value={boardEndDate[0]} index={0} onChange={handleChangeBoardEndDate} />
                          </Grid>
                        </Grid>
                      } 
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
                        {props.editBoard == undefined ?
                          <>
                            <LoadingButton key={"cancel"} variant='contained' sx={{background: 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)', borderRadius:"5px", mr:"10px"}} onClick={() => props.setNewBoardState(false)}><DeleteIcon sx={{color: 'background.paper'}} /></LoadingButton>
                            <LoadingButton type="submit" key={"next"} variant='contained' sx={{borderRadius:"5px", background:'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)'}} onClick={() => console.log(errors)}>NEXT</LoadingButton>
                          </>
                        :
                          <>
                            <LoadingButton key={"cancel"} variant='contained' sx={{background: "linear-gradient(232deg, rgba(173,173,173,1) 0%, rgba(158,158,158,1) 100%)", borderRadius:"5px", mr:"10px"}} onClick={() => props.setNewBoardState(false)}><ArrowBackIcon sx={{color: 'background.paper'}} /></LoadingButton>
                            <LoadingButton key={"delete"} variant='contained' sx={{background: 'linear-gradient(90deg, rgba(231,104,72,1) 0%, rgba(207,67,43,1) 100%)', borderRadius:"5px", mr:"10px"}} onClick={() => handleDeleteBoard(props.editBoard?.boardEntityId || "")}><DeleteIcon sx={{color: 'background.paper'}} /></LoadingButton>
                            <LoadingButton type="submit" key={"next"} variant='contained' sx={{borderRadius:"5px", background:'linear-gradient(90deg, rgba(58,203,152,1) 0%, rgba(30,177,121,1) 100%)'}} onClick={() => console.log(errors)}>UPDATE</LoadingButton>
                          </>
                        }
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
                          <Grid container>
                            <Grid item xs={2}>

                            </Grid>
                            <Grid item xs={8}  sx={{padding: '8px 8px 4px 8px'}}>
                              <Typography variant="h4">Shorter</Typography>
                            </Grid>
                            <Grid item xs={2} sx={{paddingTop: '2px'}}>
                              {sprintOptionSelected == 0 && !customLengthChecked && <CheckCircleIcon sx={{color: 'success.main'}} />}
                            </Grid>
                          </Grid>
                          <Divider />
                          <Box paddingLeft='5px'>
                            <Typography sx={{margin: '4px 4px 0px 4px', fontSize: '60px', display: 'inline-block'}}>{calculateSprintShortLength(calculateTotalLength(boardEndDate[0]))}</Typography>
                            <Typography variant="h3" sx={{margin: '4px', display: 'inline-block'}}>Days</Typography>
                          </Box>
                          <Typography variant="h5" sx={{margin: '0px 4px 4px 4px'}}>{calculateTotalLength(boardEndDate[0]) / calculateSprintShortLength(calculateTotalLength(boardEndDate[0])) !== 0 ? ("(" + calculateNumberOfSprints(calculateTotalLength(boardEndDate[0]), calculateSprintShortLength(calculateTotalLength(boardEndDate[0]))) + " Sprints)") : "" }</Typography>
                          <Divider />
                          <Typography variant='subtitle2' padding='5px'>Divide your board into smaller sections. Great for boards with smaller tasks.</Typography>
                          <Button onClick={() => setSprintOptionSelected(0)} fullWidth sx={{backgroundColor: customLengthChecked ? 'grey.400' : 'primary.main', borderRadius: '0px 0px 5px 5px', ':hover': { backgroundColor: 'primary.dark'}}} disabled={customLengthChecked}>
                              <Typography variant='h6' sx={{color: 'background.paper'}}>Select</Typography>
                          </Button>
                        </Card>
                      </Grid>
                      <Grid item xs={9} sx={{textAlign: 'left', margin: '10px 6px 6px 6px'}}>
                        <Card sx={{textAlign: 'center'}} elevation={3}>
                          <Grid container>
                            <Grid item xs={2}>

                            </Grid>
                            <Grid item xs={8}  sx={{padding: '8px 8px 4px 8px'}}>
                              <Typography variant="h4">Reccommended</Typography>
                            </Grid>
                            <Grid item xs={2}  sx={{paddingTop: '2px'}}>
                              {sprintOptionSelected == 1 && !customLengthChecked && <CheckCircleIcon sx={{color: 'success.main'}} />}
                            </Grid>
                          </Grid>
                          <Divider />
                          <Box paddingLeft='5px'>
                            <Typography sx={{margin: '4px 4px 0px 4px', fontSize: '90px', display: 'inline-block'}}>{calculateSprintRecommendedLength(calculateTotalLength(boardEndDate[0]))}</Typography>
                            <Typography variant="h3" sx={{margin: '0px 4px 4px 4px', display: 'inline-block'}}>Days</Typography>
                          </Box>
                            <Typography variant="h5" sx={{margin: '0px 4px 4px 4px'}}>{calculateTotalLength(boardEndDate[0]) / calculateSprintShortLength(calculateTotalLength(boardEndDate[0])) !== 0 ? ("(" + calculateNumberOfSprints(calculateTotalLength(boardEndDate[0]), calculateSprintRecommendedLength(calculateTotalLength(boardEndDate[0]))) + " Sprints)") : "" }</Typography>
                          <Divider />
                          <Typography variant='subtitle2' padding='5px'>Not sure where to start? We've got you covered. Our algorithm reccomends you start here!</Typography>
                          <Button onClick={() => setSprintOptionSelected(1)} fullWidth sx={{backgroundColor: customLengthChecked ? 'grey.400' : 'primary.main', borderRadius: '0px 0px 5px 5px', ':hover': { backgroundColor: 'primary.dark'}}} disabled={customLengthChecked}>
                              <Typography variant='h6' sx={{color: 'background.paper'}}>Select</Typography>
                          </Button>
                        </Card>
                      </Grid>
                      <Grid item xs={7} sx={{textAlign: 'left', margin: '20px 6px 0px 6px'}}>
                        <Card sx={{textAlign: 'center'}}  elevation={3}>
                          <Grid container>
                            <Grid item xs={2}>

                            </Grid>
                            <Grid item xs={8}  sx={{padding: '8px 8px 4px 8px'}}>
                              <Typography variant="h4">Longer</Typography>
                            </Grid>
                            <Grid item xs={2} sx={{paddingTop: '2px'}}>
                                {sprintOptionSelected == 2 && !customLengthChecked && <CheckCircleIcon sx={{color: 'success.main'}} />}
                            </Grid>
                          </Grid>
                          <Divider />
                          <Box paddingLeft='5px'>
                            <Typography sx={{margin: '4px 4px 0px 4px', fontSize: '60px', display: 'inline-block'}}>{calculateSprintLongLength(calculateTotalLength(boardEndDate[0]))}</Typography>
                            <Typography variant="h3" sx={{margin: '4px', display: 'inline-block'}}>Days</Typography>
                          </Box>
                          <Typography variant="h5" sx={{margin: '0px 4px 4px 4px'}}>{calculateTotalLength(boardEndDate[0]) / calculateSprintShortLength(calculateTotalLength(boardEndDate[0])) !== 0 ? ("(" + calculateNumberOfSprints(calculateTotalLength(boardEndDate[0]), calculateSprintLongLength(calculateTotalLength(boardEndDate[0]))) + " Sprints)") : "" }</Typography>
                          <Divider />
                          <Typography variant='subtitle2' padding='5px'>Divide your board into longer sections. Better for boards with broader tasks</Typography>
                          <Button onClick={() => setSprintOptionSelected(2)} fullWidth sx={{backgroundColor: customLengthChecked ? 'grey.400' : 'primary.main', borderRadius: '0px 0px 5px 5px', ':hover': { backgroundColor: 'primary.dark'}}} disabled={customLengthChecked}>
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
                          <Select defaultValue={'start'} value={overflow} size='small' onChange={(event) => setOverflow(event.target.value)}>
                            <MenuItem value={'start'}>Attach to start</MenuItem>
                            <MenuItem value={'end'}>Attach to end</MenuItem>
                          </Select>
                        </Box>
                      </Grid>
                      <Grid item xs={6} textAlign='center' >
                        <Box>
                          
                          <Grid container width='fit-content'>
                            <Grid item xs = {1} marginTop='auto' marginBottom='auto'>
                              <Checkbox sx={{color: 'grey.600', marginRight: '10px'}} value={customLengthChecked} onChange={(event, checked) => {setCustomLengthChecked(checked); setCurrentCustomSprintLength(calculateSprintRecommendedLength(calculateTotalLength(boardEndDate[0])))}} />
                            </Grid>
                            <Grid item xs={4} textAlign='right' marginTop='auto' marginBottom='auto' alignItems='center'>
                              <Typography sx={{color: customLengthChecked ? 'grey.800' : 'grey.400'}} component='span' variant='h5'>Custom length:&nbsp;&nbsp;</Typography>
                            </Grid> 
                            <Grid item xs={6} marginTop='auto' marginBottom='auto'>
                              <TextField value={customLengthChecked ? currentCustomSprintLength : ""} onChange={(event) => {event.target.value == "" ? setCurrentCustomSprintLength(undefined) : parseInt(event.target.value) > 0 && setCurrentCustomSprintLength(parseInt(event.target.value))}} size='small' disabled={!customLengthChecked} placeholder="Days" type='number' helperText={currentCustomSprintLength !== undefined && endDateEnabled && currentCustomSprintLength > 0 && customLengthChecked ? (calculateNumberOfSprints(calculateTotalLength(boardEndDate[0]), currentCustomSprintLength) + " Sprints") : ""}/>   
                            </Grid>
                          </Grid>
                        </Box>                      
                      </Grid>
                  </Grid>
                </Box>
                <Divider />
                <Box padding='20px'>
                  <Typography variant="caption">Board sprints:</Typography>
                  <SprintVisualizer overflowOption={overflow} sprintLength={findSprintLength() || 0} totalLength={calculateTotalLength(boardEndDate[0]) || 0} />
                </Box>
                <Box>
                  <Grid container>
                      <Grid item xs={3}>
                        <Box sx={{flexGrow: 1, textAlign: 'left', marginRight: '5px', marginTop: '5px', padding: '10px'}}>
                          <Button key={"back"} variant='contained' sx={{margin: 'auto', background: "linear-gradient(232deg, rgba(173,173,173,1) 0%, rgba(158,158,158,1) 100%)", borderRadius:"5px", mr:"10px"}} onClick={() => handleGoBack()}>GO BACK</Button>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        
                      </Grid>
                      <Grid item xs={3}>
                        <Box sx={{flexGrow: 1, textAlign: 'right',  marginRight: '5px', marginTop: '5px', padding: '10px'}}>
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