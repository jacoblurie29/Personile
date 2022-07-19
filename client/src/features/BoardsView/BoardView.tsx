import { Box, Fade, Grid, Grow, IconButton, Zoom } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import BoardCard from "./BoardCard";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import NewBoard from "./NewBoard";

export default function BoardView() {

    const boards = useAppSelector(state => state.user.userData?.boards);

    const [newBoard, setNewBoard] = useState<boolean>(false);

    const setNewBoardState = (state: boolean) => {
        setNewBoard(state);
    }

    return (

        <Grid container padding='20px'>
            {boards?.map((board, index) => (
                <Zoom in={true} timeout={index + 1 * 500 } key={"boardCard-" + index}>  
                    <Grid item xl={4} md={6} xs={12} sx={{paddingTop: '20px'}}>
                        <BoardCard board={board} />
                    </Grid>
                </Zoom>
            ))}
            <Zoom in={true} timeout={boards?.length === undefined ? 500 : boards.length + 1 * 500}> 
                <Grid item xl={4} md={6} xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: {xs: '450px'}, paddingTop: '20px'}}>
                    <Box sx={{ border: '1px dashed grey', height: {xs: '90%', md: '100%'}, width: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px'}}>
                        <IconButton sx={{ backgroundColor: "primary.main"}} onClick={() => setNewBoard(true)}>
                            <AddIcon sx={{ color: "background.paper"}}/>
                        </IconButton>
                    </Box>
                </Grid>
            </Zoom>
            {newBoard && <NewBoard setNewBoardState={setNewBoardState} />}
        </Grid>

    )
}