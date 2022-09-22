import { Box, Card, Grid, Typography, useTheme } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";


export default function TopView_LayoutBox() {

    const { currentBoard } = useAppSelector(state => state.sprintView);
    const boards = useAppSelector(state => state.user.userData?.boards);
    const board = boards?.find(b => b.boardEntityId == currentBoard)

    return (
        <Box margin='10px 10px 0px 0px' sx={{ height: '100%', borderRadius: '15px', padding: '10px'}}>
            <Typography variant="h1" sx={{color: 'primary.dark', textAlign: 'left', fontSize:'55px'}}>{board?.name}<Box component='span' sx={{color: 'secondary.light'}}>.</Box></Typography>
        </Box>
    )
}