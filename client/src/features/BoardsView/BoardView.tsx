import { Grid, IconButton } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import BoardCard from "./BoardCard";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import NewBoard from "./NewBoard";

export default function BoardView() {

    const boards = useAppSelector(state => state.user.userData?.boards);

    const [newBoard, setNewBoard] = useState<boolean>(false);

    return (

        <Grid container padding='20px'>
            {boards?.map((board, index) => (
                <Grid item xs={4} key={"boardCard-" + index}>
                    <BoardCard board={board} />
                </Grid>
            ))}
            <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed grey', borderRadius: '5px'}}>
                <IconButton sx={{ backgroundColor: "primary.main"}} onClick={() => setNewBoard(true)}>
                    <AddIcon sx={{ color: "background.paper"}}/>
                </IconButton>
            </Grid>
            {newBoard && <NewBoard />}
        </Grid>

    )
}