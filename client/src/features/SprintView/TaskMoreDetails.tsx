import { Grid, Typography, Chip, LinearProgress, linearProgressClasses, styled, Tooltip, Box } from "@mui/material";
import { Task } from "../../app/models/task";
import SubTasksView from "./SubTasksView";

interface Props {
    focusedTask: Task,
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundImage: 'linear-gradient(to right, #0fe21f, #6ee11a, #99e023, #bade34, #d4dd47, #e4d346, #f1c84a, #fbbe51, #ffa74c, #ff8f4e, #ff7755, #fb5f5f)',
    },
}));

export default function TaskMoreDetails({ focusedTask }: Props) {


    return (
        <Box paddingBottom='10px'>
            {focusedTask.tags !== '' && 
            <>
                <Typography variant="caption" sx={{color: 'white'}}>Tags&nbsp;({focusedTask.tags !== '' ? focusedTask.tags.split("|").length : 0})</Typography>
                
                <Grid container padding='10px' display='flex' alignItems="center" justifyContent="center" border='1px solid #ECECEC' sx={{borderRadius: '5px', mb: '5px'}}>
                
                    <Grid item justifyContent='center' sx={{margin: 'auto'}}>
                    {focusedTask?.tags.split('|').map((tag, index) => (
                        <Chip key={tag} label={tag} sx={{margin: '2px', backgroundColor: '#EEEEEE'}} />
                    ))}
                    </Grid>
                </Grid>
            </>
            }
            <Typography variant="caption" sx={{color: 'white'}}>Estimated effort</Typography>
            <Tooltip title={focusedTask.effort} arrow>
            <BorderLinearProgress sx={{mt: '2px', mb: '12px', boxShadow: '1px 2px 7px #777777' }} variant="determinate" value={focusedTask.effort * 10} />
            </Tooltip>
            <Typography variant="caption" sx={{color: 'white'}}>Subtasks&nbsp;({focusedTask.subTasks.length})</Typography>
            <SubTasksView task={focusedTask} isDialog={true} />         
        </Box>
    )
}

/*
<Grid container paddingTop='10px' display='flex'>
    <Grid item xs={6}>
        {focusedTask?.dueDate &&
            <Typography variant="body1" sx={{flexGrow: 1, textAlign: 'right', verticalAlign: "middle", mr: '20px'}}>
                Due date:&nbsp;
                { 
                new Date(focusedTask?.dueDate).toLocaleDateString()
                }
            </Typography>                                
        }
    </Grid>
</Grid>
*/