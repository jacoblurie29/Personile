import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Link, useHistory } from "react-router-dom";
import { FieldValues, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import agent from "app/api/agent";
import { registerUserAsync, signInUserAsync } from "app/state/userSlice";
import { useAppDispatch } from "app/store/configureStore";
const theme = createTheme();

export default function RegisterView() {
  // react hook form
  const {
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  // redux
  const history = useHistory();
  const dispatch = useAppDispatch();

  // register the use on submit
  async function handleSubmitRegister(data: FieldValues) {
    var registerData = { ...data, username: data.email };
    await dispatch(registerUserAsync(registerData));
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
            Welcome
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
            It's time to rethink your next project.
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
            Register
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(handleSubmitRegister)}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              autoComplete="lastName"
              autoFocus
              {...register("firstName", {
                required: "First name is required!",
              })}
              error={!!errors.firstName}
              helperText={errors?.firstName?.message?.toString()}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              autoComplete="lastName"
              {...register("lastName", { required: "Last name is required!" })}
              error={!!errors.lastName}
              helperText={errors?.lastName?.message?.toString()}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              {...register("email", {
                required: "Email is required!",
                validate: (val: string) => {
                  if (!/^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/.test(val)) {
                    return "Invalid email address!";
                  }
                },
              })}
              error={!!errors.email}
              helperText={errors?.email?.message?.toString()}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              {...register("password", {
                required: "Password is required!",
                validate: (val: string) => {
                  if (val.length < 8) {
                    return "Your password must be at least 8 characters";
                  }
                  if (val.search(/[a-z]/i) < 0) {
                    return "Your password must contain at least six letters.";
                  }
                  if (val.search(/[0-9]/) < 0) {
                    return "Your password must contain at least one digit.";
                  }
                  if (
                    val.search(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) < 0
                  ) {
                    return "Your password must contain at least one special character.";
                  }
                },
              })}
              error={!!errors.password}
              helperText={errors?.password?.message?.toString()}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                validate: (val: string) => {
                  if (watch("password") != val) {
                    return "Your passwords do no match";
                  }
                },
              })}
              error={!!errors.confirmPassword}
              helperText={errors?.confirmPassword?.message?.toString()}
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
              Register
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
                    history.push("/login");
                  }}
                >
                  {"Have an account? Log in"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
