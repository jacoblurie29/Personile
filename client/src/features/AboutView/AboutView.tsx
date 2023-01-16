import { Box, Divider, Grid, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { flexbox } from "@mui/system";

export default function AboutView() {
  return (
    <Box
      sx={{
        width: "100%",
        paddingTop: "150px",
        justifyContent: "flex-start !important",
      }}
    >
      <Grid container columns={12} sx={{ padding: "40px" }}>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "30px",
          }}
        >
          <Typography variant="h1">What is</Typography>
          <Typography variant="h1">&nbsp;Personile</Typography>
          <Typography
            variant="h1"
            sx={{ color: "secondary.light", fontFamily: "Open Sans" }}
          >
            ?
          </Typography>
        </Grid>
        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            component={"img"}
            src="/computerImage.png"
            alt="Computer"
            sx={{ height: "220px", opacity: "85%", paddingRight: "150px" }}
          ></Box>
        </Grid>
      </Grid>
      <Divider sx={{ margin: "10px 40px" }} />
      <Grid container columns={12} sx={{ padding: "40px" }}>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "30px",
          }}
        >
          <Box
            component={"img"}
            src="/SprintScreenshot.png"
            alt="Computer"
            sx={{
              height: "300px",
              width: "fit-content",
              opacity: "85%",
              boxShadow: "5px 5px 15px #888888",
              borderRadius: "25px",
            }}
          ></Box>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "30px",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h1" sx={{ textAlign: "right" }}>
                Divide your work into sprints
                <Box
                  component="span"
                  sx={{ color: "secondary.light", fontFamily: "Open Sans" }}
                >
                  .
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ textAlign: "right" }}>
                Break up longer projects using the Agile technique of
                organization.
                <br />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Divider sx={{ margin: "10px 40px" }} />
      <Grid container columns={12} sx={{ padding: "40px" }}>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "30px",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h1">
                Create boards for all of your projects
                <Box
                  component="span"
                  sx={{ color: "secondary.light", fontFamily: "Open Sans" }}
                >
                  .
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ textAlign: "left" }}>
                Keep track of your work on multiple projects.
                <br />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "30px",
          }}
        >
          <Box
            component={"img"}
            src="/BoardsScreenshot.png"
            alt="Computer"
            sx={{
              height: "300px",
              width: "fit-content",
              opacity: "85%",
              boxShadow: "5px 5px 15px #888888",
              borderRadius: "25px",
            }}
          ></Box>
        </Grid>
      </Grid>
      <Divider sx={{ margin: "10px 40px" }} />
      <Grid container columns={12} sx={{ padding: "40px" }}>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "30px",
          }}
        >
          <Box
            component={"img"}
            src="/DashboardScreenshot.png"
            alt="Computer"
            sx={{
              height: "300px",
              width: "fit-content",
              opacity: "85%",
              boxShadow: "5px 5px 15px #888888",
              borderRadius: "25px",
            }}
          ></Box>
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: "30px",
          }}
        >
          <Grid container>
            <Grid item xs={12}>
              <Typography variant="h1" sx={{ textAlign: "right" }}>
                Manage all your projects in one place
                <Box
                  component="span"
                  sx={{ color: "secondary.light", fontFamily: "Open Sans" }}
                >
                  .
                </Box>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ textAlign: "right" }}>
                Become a pro at managing every project.
                <br />
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
