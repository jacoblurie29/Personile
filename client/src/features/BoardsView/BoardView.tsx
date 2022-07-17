import { Grid } from "@mui/material";
import { useAppSelector } from "app/store/configureStore";
import BoardCard from "./BoardCard";
import NewBoardCard from "./NewBoardCard";

export default function BoardView() {

    const boards = useAppSelector(state => state.user.userData?.boards);

    return (

        <Grid container>
            {boards?.map((board, index) => (
                <Grid item xs={4}>
                    <BoardCard board={board} />
                </Grid>
            ))}
            <Grid item xs={4}>
                <NewBoardCard />
            </Grid>
        </Grid>

    )
}