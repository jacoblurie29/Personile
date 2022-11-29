import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useAppDispatch, useAppSelector } from "app/store/configureStore";
import EastIcon from '@mui/icons-material/East';
import { useHistory } from "react-router-dom";
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import { useState } from "react";
import { FieldValue, FieldValues, FormProvider, useForm } from "react-hook-form";
import NewEditTaskTextField from "features/SprintView/NewEditTask/NewEditTask_TextField";
import EditProfileTextField from "./EditProfileTextField";
import { UpdateUser } from "app/models/updateUser";
import { updateUserAsync } from "app/state/userSlice";
import { LoadingButton } from "@mui/lab";

export default function ProfileView() {

    const user = useAppSelector(state => state.user.userData);

    const allTasks = user?.boards.flatMap(b => b.sprints.flatMap(s => s.tasks));
    const remainingTasks = allTasks?.filter(t => t.currentState !== 2).length;
    const totalTasks = user?.boards.length;
    const tasksCompletedYesterday = allTasks?.filter(t => {
        return Date.now() - Date.parse(t.dateFinished) < (86400000 + new Date().getTime()) && (Date.now() - Date.parse(t.dateFinished) > new Date().getTime());
    }).length;
    const tasksCompletedThisWeek = allTasks?.filter(t => {
        return Date.now() - Date.parse(t.dateFinished) < 86400000 * 7;
    }).length;
    const history = useHistory();
    const dispatch = useAppDispatch();

    // more react hook form
    const {control, handleSubmit, getValues} = useForm();
    const methods = useForm();

    const [hover, setHover] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);


    const handleEditUser = (data: FieldValues) => {
        var userDto = {
            userEntityId: user?.userEntityId,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email
        } as UpdateUser;

        if (data.firstName == user?.firstName && data.lastName == user?.lastName && data.email == user?.email) return;

        setLoading(true);
        dispatch(updateUserAsync({newData: userDto})).catch((error) => console.log(error)).finally(() => {setHover(false); setIsEdit(false); setLoading(false);});
    }

    
    return (
        <>
            <Box display='flex' justifyContent='center' marginTop='100px'>
                <Box sx={{height: '150px', width: '150px', borderRadius: '75px', backgroundColor: 'rgba(153, 208, 211, 0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', ':hover': {cursor: 'pointer', backgroundColor: 'rgba(153, 208, 211, 1.0)'}}}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    onClick={() => {setIsEdit(!isEdit)}}>
                    {!hover && !isEdit && <Typography variant='h1' fontSize={'50px'} sx={{color: 'white'}}>{user?.firstName.substring(0,1).toLocaleUpperCase()}{user?.lastName.substring(0,1).toLocaleUpperCase()}</Typography>}
                    {hover && !isEdit && <Typography variant='h1' fontSize={'50px'} sx={{color: 'white'}}><EditIcon sx={{fontSize: '60px', marginTop: '10px'}} /></Typography>}
                    {isEdit && <Typography variant='h1' fontSize={'50px'} sx={{color: 'white'}}><ClearIcon sx={{fontSize: '60px', marginTop: '10px'}} /></Typography>}
                </Box>
            </Box>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit((data) => {handleEditUser(data)})}>
                    <Box display='flex' justifyContent='center' marginTop='20px'  width={'20%'} margin='auto' sx={{paddingTop: isEdit ? '20px' : '0px'}}>
                        {!isEdit &&<Typography variant="h1" sx={{color: 'grey.600'}}>{user?.firstName}&nbsp;{user?.lastName}</Typography>}
                        {isEdit && <>
                            <EditProfileTextField control={control} label="First Name" name="firstName" editvalue={user?.firstName}/>
                            <EditProfileTextField control={control} label="Last Name" name="lastName" editvalue={user?.lastName}/>
                        </>}
                    </Box>
                    <Box display='flex' justifyContent='center' marginTop='0px' width={'20%'} margin='auto'>
                        {!isEdit &&<Typography variant="h4" sx={{color: 'grey.400'}}>{user?.email}</Typography>}
                        {isEdit && <EditProfileTextField control={control} label="Email" name="email" editvalue={user?.email}/>}
                    </Box>
                    <Box display='flex' justifyContent='center' marginTop='10px' width={'20%'} margin='auto'>
                        {isEdit && <LoadingButton loading={loading} variant='contained' type="submit">
                            <Typography variant="h4" sx={{color: 'background.paper'}}>Update</Typography>
                        </LoadingButton>}
                    </Box>
                </form>
            </FormProvider>
            <Box sx={{textAlign: 'center', marginTop: '50px'}}>
                <Typography sx={{color: 'primary.main'}} variant="h1">{"You have "}<Box component={"span"} sx={{color: '#c99eec'}}>{remainingTasks}</Box>{" remaining tasks on "}<Box component={"span"} sx={{color: '#c99eec'}}>{totalTasks}</Box>{((user?.boards.length || 1) == 1 ? " board." : " boards.")}</Typography>
                <Typography sx={{color: 'primary.main'}} variant="h1">{"Yesterday you completed "}<Box component={"span"} sx={{color: '#c99eec'}}>{tasksCompletedYesterday}</Box>{(tasksCompletedYesterday == 1 ? " task." : " tasks.") }</Typography>
                <Typography sx={{color: 'primary.main'}} variant="h1">{"In the last week you have completed "}<Box component={"span"} sx={{color: '#c99eec'}}>{tasksCompletedThisWeek}</Box>{(tasksCompletedThisWeek == 1 ? " task." : " tasks.") }</Typography>
                <Button variant='contained' sx={{marginTop: '25px'}} onClick={() => history.push('/dashboard')}>
                    <Typography variant="h3" sx={{color: 'background.paper'}}>Go to dashboard&nbsp;</Typography>
                    <EastIcon sx={{color: 'white'}} />
                </Button>
            </Box>
        </>       
    )
}