import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link, useHistory } from 'react-router-dom';
import { FieldValues, useForm } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import agent from 'app/api/agent';
import { registerUserAsync, signInUserAsync } from 'app/state/userSlice';
import { useAppDispatch } from 'app/store/configureStore';
const theme = createTheme();

export default function RegisterView() {

  // react hook form
  const {register, watch, handleSubmit, formState: {isSubmitting, errors, isValid}} = useForm({
      mode: 'all'
  });

  // redux
  const history = useHistory();
  const dispatch = useAppDispatch();

  // register the use on submit
  async function handleSubmitRegister(data: FieldValues)  {
    console.log("TEST PASSED");
    var registerData = {...data, username: data.email};
    console.log(registerData);
    await dispatch(registerUserAsync(registerData));
    history.push('/sprint');
  }



  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundColor: 'linear-gradient(352deg, rgba(7,20,22,1) 0%, rgba(13,37,41,1) 100%)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'rgba(7,20,22,1)' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Register
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(handleSubmitRegister)} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoComplete="lastName"
                autoFocus
                {...register('firstName', {required: 'First name is required!'})}
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
                {...register('lastName', {required: 'Last name is required!'})}
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
                {...register('email', {required: 'Email is required!'})}
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
                {...register('password', {required: 'Password is required!'})}
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
                    if (watch('password') != val) {
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
                  <Link to="/register">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}