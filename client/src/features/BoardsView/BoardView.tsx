import { Grid, IconButton } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import BoardCard from "./BoardCard";
import AddIcon from '@mui/icons-material/Add';

export default function BoardView() {

    const boards = useAppSelector(state => state.user.userData?.boards);

    return (

        <Grid container padding='20px'>
            {boards?.map((board, index) => (
                <Grid item xs={4} key={"boardCard-" + index}>
                    <BoardCard board={board} />
                </Grid>
            ))}
            <Grid item xs={4} sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed grey', borderRadius: '5px'}}>
                <IconButton sx={{ backgroundColor: "primary.main"}} >
                    <AddIcon sx={{ color: "background.paper"}}/>
                </IconButton>
            </Grid>
        </Grid>

    )
}