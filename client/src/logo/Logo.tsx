import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Box, Typography } from "@mui/material";

export default function Logo() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", margin: "10px" }}>
      <Box
        sx={{
          backgroundColor: "primary.light",
          borderRadius: "30px",
          height: "60px",
          width: "60px",
        }}
      >
        <CalendarMonthIcon
          sx={{
            color: "white",
            fontSize: "40px",
            marginLeft: "10px",
            marginTop: "10px",
          }}
        />
      </Box>
      <Typography variant="h1" sx={{ color: "grey.800" }}>
        &nbsp;Personile
        <Box
          component={"span"}
          sx={{
            color: "secondary.light",
            fontSize: "40px",
            fontFamily: "Open Sans",
          }}
        >
          .
        </Box>
      </Typography>
    </Box>
  );
}
