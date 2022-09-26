import { Box, Fade, Grid, Grow, IconButton, Zoom, Typography } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import ViewBoardCard from "../ViewBoard/ViewBoard_Card";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import { Board } from "app/models/board";
import NewBoardCard from "../NewBoard/NewBoard_Card";

export default function BoardView() {

    const boards = useAppSelector(state => state.user.userData?.boards);

    const [newBoard, setNewBoard] = useState<boolean>(false);
    const [editBoard, setEditBoard] = useState<Board | undefined>(undefined);
    //const [animationBooleans, setAnimationBooleans] = useState<boolean[]>(boards?.map(b => true) || []);

    const setNewBoardState = (state: boolean, editBoard?: Board, index?: number) => {
        setNewBoard(state);
        setEditBoard(editBoard);
    }


    return (
        <Box margin='20px 10px 0px 0px' overflow='auto' sx={{backgroundColor: '#D9E8F9', height: '85%', borderRadius: '15px'}}>
            <Grid container>
                {boards?.map((board, index) => (
                    <Grid item xl={4} md={6} xs={12} sx={{paddingTop: '20px'}} key={"board-" + index}>
                        <ViewBoardCard board={board} setNewBoardState={setNewBoardState} indexForAnimation={index} animationBoolean={true}  />
                    </Grid>
                ))}
                <Zoom in={true} timeout={boards?.length === undefined ? 300 : (boards.length) * 500}> 
                    <Grid item xl={4} md={6} xs={12} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: {xs: '450px'}, paddingTop: '20px'}}>
                        <Box sx={{ border: '1px dashed grey', height: {xs: '90%', md: '100%'}, width: '90%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '5px'}}>
                            <IconButton sx={{ backgroundColor: "primary.main"}} onClick={() => setNewBoard(true)}>
                                <AddIcon sx={{ color: "background.paper"}}/>
                            </IconButton>
                        </Box>
                    </Grid>
                </Zoom>
                {newBoard && <NewBoardCard setNewBoardState={setNewBoardState} editBoard={editBoard} />}
            </Grid>
        </Box>

    )
}