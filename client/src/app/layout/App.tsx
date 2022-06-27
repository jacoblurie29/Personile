import CssBaseline from '@mui/material/CssBaseline';
import Navigation from "./Navigation";


/*
  VISUAL NOTES

  Side bar using MUI mini-variant drawer
  List components in 3 wide grid
  Each task in cards
  Cards are ordered by the state of the task item

  App (Contains body) -> SprintView -> TaskStateColumn
*/

function App() {

  
  return (
    <>      
        <Navigation />
    </>
  );
}

export default App;
