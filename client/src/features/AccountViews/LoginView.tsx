import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { Link, useHistory } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch } from "app/store/configureStore";
import { signInUserAsync } from "app/state/userSlice";

export default function LoginView() {
  // redux
  const history = useHistory();
  const dispatch = useAppDispatch();

  // react hook form
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  // submit the form to sign in
  async function submitForm(data: FieldValues) {
    await dispatch(signInUserAsync(data));
    history.push("/dashboard");
  }

  return (
    <Grid container sx={{ height: "100vh" }} columns={12}>
      <Grid
        item
        sm={4}
        md={7}
        lg={7}
        xl={7}
        sx={{
          background:
            "linear-gradient(132deg, rgba(233,252,255,1) 0%, rgba(255,255,255,1) 48%, rgba(244,232,255,1) 100%)",
        }}
        display={{ xs: "none", sm: "block" }}
      >
        <Box textAlign={"center"} paddingTop={"350px"}>
          <Typography fontSize={"50px"} variant="h1">
            Welcome back
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
          <Typography fontSize={"20px"} variant="body1">
            Let's get back to work.
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "rgba(7,20,22,1)" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(submitForm)}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              {...register("username", { required: "Email is required!" })}
              error={!!errors.username}
              helperText={errors?.username?.message?.toString()}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register("password", { required: "Password is required!" })}
              error={!!errors.password}
              helperText={errors?.password?.message?.toString()}
            />
            {/* 
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              */}
            <LoadingButton
              disabled={!isValid}
              loading={isSubmitting}
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </LoadingButton>
            <Grid container>
              {/* 
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                */}
              <Grid item>
                <Typography
                  component={"a"}
                  sx={{
                    textDecoration: "underline",
                    ":hover": { cursor: "pointer" },
                  }}
                  onClick={() => {
                    history.push("/register");
                  }}
                >
                  {"Don't have an account? Sign Up"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
