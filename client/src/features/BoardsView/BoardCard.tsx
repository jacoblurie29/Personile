import { Card, Typography } from "@mui/material"
import { Board } from "app/models/board"

interface Props {
    board: Board
}

export default function BoardCard({board}: Props) {

    return (

        <Card sx={{width: '90%', height: '90%', margin: 'auto'}}>
            <Typography variant="h3">{board.boardEntityId}</Typography>
        </Card>

    )
}