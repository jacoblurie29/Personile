import { Box, Card, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { Task } from "app/models/task";
import { useAppSelector } from "app/store/configureStore";
import { Fragment, useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import SummaryCard from "../SummaryView/SummaryView_SummaryCard";
import SummaryNewEditTaskCard from "../SummaryView/SummaryView_SummaryNewEditTaskCard";
import { fontSize } from "@mui/system";

interface Props {
    taskToBeEditedId: string[],
    toggleEditTask: (val: string) => void
}

export default function SummaryView({taskToBeEditedId, toggleEditTask}: Props) {

    // base task array
    const allTasks : Task[] = [];

    // redux state
    const { currentBoard } = useAppSelector(state => state.sprintView);
    const tasks = useAppSelector(state => state.user.userData?.boards.find(b => b.boardEntityId == currentBoard)?.sprints?.flatMap(s => s.tasks)) || [];

    // react theme
    const theme = useTheme();

    // react state
    const [newTask, setNewTask] = useState<boolean>(false);

    // styles
    const iconButtonStyles = {
        boxShadow: '0.1rem 0.1rem 0.1rem 0.1rem rgba(100,100,100, 0.2)',
        height: 'fit-content',
        marginTop: 'auto',
        marginBottom: 'auto',
        backgroundColor: theme.palette.background.paper,
        '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#DDDDDD',
        }
    }
    const cardStyles = {
        borderRadius: '5px 5px 0 0',
        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    }

    return (
            <Box sx={{width: "100%"}}>
                <>
                    <Card sx={cardStyles}>
                        <Box flexGrow={1}>
                            <Grid container>
                                <Grid item xs={8}>
                                    <Typography variant='h2' sx={{fontWeight: '700', color: 'white', padding: '15px'}}>{"Tasks"}</Typography>
                                </Grid>
                                <Grid item xs={4} display='flex' justifyContent="right" flexGrow={1} sx={{paddingRight: '25px'}}>
                                    <IconButton 
                                        sx={iconButtonStyles} onClick={() => setNewTask(!newTask)}>
                                        <AddIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Box>
                    </Card>
                    <>
                        {newTask && <SummaryNewEditTaskCard setNewTask={setNewTask} toggleEditTask={toggleEditTask}/>}
                        {tasks.map((task, index) => (
                            <Fragment key={"Fragment" + task.taskEntityId + index}>
                            {!taskToBeEditedId.includes(task.taskEntityId) ? 
                                (<SummaryCard task={task} index={index} key={"SummaryCard-" + index} toggleEditTask={toggleEditTask} />)
                                    :
                                (<SummaryNewEditTaskCard toggleEditTask={toggleEditTask} key={"Editor" + task.taskEntityId + index} setNewTask={setNewTask} editTask={task}/>)}
                            </Fragment>
                        ))}
                    </>
                </>
                 
              {  
            /*
                I need to define a new card here, along with a new edit card for this view.
                It is worth looking into reusing parts of the old cards however the new structure will most likely
                require a completly new element. 

                New card view will have action buttons and an expandable pain for the information. 
                Will use React router as function for editing the task. 
                Should look the same as the column cards except written out horizontally instead of vertically.

                The new cards should be order with the following hierarchy:

                    1. Sprint (Most recent at top)
                    2. Two blocks - One with due dates, the other without
                    3. Non - due date will be ordered by creation date for now


                I think the tasks need a new data point called "order" which will be a unique sequential identifier
                that is created upon them being added. For now, we can use up/down arrows in the summary view to move them but 
                in the future React draggable is an option. In the sprint view, the order will be followed but it can only be
                altered in the summary view. Maybe small up/down arrow buttons can make requests to change order in both.

                TODO for this:

                Create cards (view + add/edit for the new view)
                Work on sizing for cards on window shrink/grow
                Create functions for toggles on the cards (edit, delete, up, down, change state (tri-button))
                Create order data point
                Create endpoint for order manipulation
                Add ordering to the creation of new tasks (front AND backend (the seed data))
                Add ordering to sprint view
                Add ordering to the summary view
                Debug/Cleanup
            */
        }
    </Box>

    );
}