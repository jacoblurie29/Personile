import { Box, Card, Link, Typography } from "@mui/material";
import { Board } from "app/models/board";
import { useHistory } from "react-router-dom";
import ProgressWidgetBoardView from "./ProgressWidget_BoardView";

interface Props {
  boards: Board[];
}

export default function ProgressWidgetCard({ boards }: Props) {
  const history = useHistory();

  const boxStyles = {
    display: "flex",
    justifyContent: "center",
  };

  const linkStyles = {
    color: "grey.600",
    textAlign: "center",
    margin: "5px auto",
    textDecoration: "underline",
    ":hover": {
      color: "grey.800",
      cursor: "pointer",
    },
  };

  return (
    <Card
      elevation={0}
      sx={{
        height: "95%",
        width: "95%",
        overflowY: "auto",
        borderRadius: "25px",
        border: "1px solid",
        borderColor: "grey.400",
        padding: "20px",
      }}
    >
      <>
        <Typography
          variant="h2"
          sx={{ margin: "10px 0px 5px 10px", color: "grey.600" }}
        >
          Board progress
        </Typography>
        {boards.map((board, index) => (
          <ProgressWidgetBoardView
            board={board}
            index={index}
            max={boards.length - 1}
            key={index}
          />
        ))}
        <Box sx={boxStyles}>
          <Link
            variant="subtitle2"
            sx={linkStyles}
            onClick={() => {
              history.push("/boards");
            }}
          >
            Go to boards
          </Link>
        </Box>
      </>
    </Card>
  );
}
