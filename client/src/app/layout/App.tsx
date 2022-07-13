import { ToastContainer } from 'react-toastify';
import Navigation from "./Navigation";
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@emotion/react';
import { createTheme, responsiveFontSizes } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/store/configureStore';
import { useEffect } from 'react';
import { fetchCurrentUser } from 'app/state/userSlice';
import { setCurrentSprint, setLoading } from 'features/SprintView/sprintSlice';


/*
  VISUAL NOTES

  Side bar using MUI mini-variant drawer
  List components in 3 wide grid
  Each task in cards
  Cards are ordered by the state of the task item

  App (Contains body) -> SprintView -> TaskStateColumn
*/

const theme = createTheme({
  palette: {
      primary: {
          light: '#e3f2fd',
          main: '#2196f3',
          dark: '#1e88e5',
          200: '#90caf9',
          800: '#1565c0'
      },
      secondary: {
          light: '#ede7f6',
          main: '#673ab7',
          dark: '#5e35b1',
          200: 'b39ddb',
          800: '#4527a0'
      },
      error: {
          light: '#f5c4c4',
          main: '#f44336',
          dark: '#c62828'
      },
      warning: {
          light: '#fff8e1',
          main: '#ffe57f',
          dark: '#ffc107'
      },
      success: {
          light: '#cdf7d9',
          200: '#69f0ae',
          main: '#00e676',
          dark: '#00c853'
      },
      grey: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          900: '#212121',

      },
      text: {
          primary: '#000000',
          secondary: '#8492c4'
      },
      background: {
          paper: '#ffffff',
          default: '#dce3e8'
      }
    },
    typography: {
        fontFamily: "Poppins",
        h6: {
            fontWeight: 500,
            color: '#212121',
            fontSize: '0.75rem'
        },
        h5: {
            fontSize: '0.875rem',
            color: '#212121',
            fontWeight: 500
        },
        h4: {
            fontSize: '1rem',
            color: '#212121',
            fontWeight: 600
        },
        h3: {
            fontSize: '1.25rem',
            color: '#212121',
            fontWeight: 600
        },
        h2: {
            fontSize: '1.5rem',
            color: '#212121',
            fontWeight: 700
        },
        h1: {
            fontSize: '2.125rem',
            color: '#212121',
            fontWeight: 700
        },
        subtitle1: {
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#212121'
        },
        subtitle2: {
            fontSize: '0.75rem',
            fontWeight: 400,
            color: '#9e9e9e',
        },
        caption: {
            fontSize: '0.75rem',
            color: '#9e9e9e',
            fontWeight: 400
        },
        body1: {
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: '1.334em'
        },
        body2: {
            letterSpacing: '0em',
            fontWeight: 400,
            lineHeight: '1.5em',
            color: '#616161'
        },
        button: {
            textTransform: 'capitalize'
        }
    }
});


function App() {
  
  const dispatch = useAppDispatch();
  const userData = useAppSelector(state => state.user.userData);

  useEffect(() => {
    dispatch(setLoading(true))
    dispatch(fetchCurrentUser()).then(() => dispatch(setLoading(false)));
  }, [dispatch])
  
  
  return (
    <>
        <ToastContainer position="bottom-left"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        theme='dark'
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover/>
        <ThemeProvider theme={theme}>

          {/* THIS IS WHERE YOU DECIDE BETWEEN HOME PAGE AND DASHBOARD */}
          {userData !== null && <Navigation />} 
          
        </ThemeProvider>
       
    </>
  );
}

export default App;
