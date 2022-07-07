import { ToastContainer } from 'react-toastify';
import Navigation from "./Navigation";
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@emotion/react';
import { createTheme, responsiveFontSizes } from '@mui/material';


/*
  VISUAL NOTES

  Side bar using MUI mini-variant drawer
  List components in 3 wide grid
  Each task in cards
  Cards are ordered by the state of the task item

  App (Contains body) -> SprintView -> TaskStateColumn
*/

let theme = createTheme({
  palette: {
    primary: {
      main: '#FFFFFF'
    },
    secondary: {
      main: '#FFFFFF'
    }
  }
});





function App() {
  
  theme = responsiveFontSizes(theme);
  
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
          <Navigation />
        </ThemeProvider>
       
    </>
  );
}

export default App;
