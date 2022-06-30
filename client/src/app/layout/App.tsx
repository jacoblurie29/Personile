import { ToastContainer } from 'react-toastify';
import Navigation from "./Navigation";
import 'react-toastify/dist/ReactToastify.css';


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
        <Navigation />
    </>
  );
}

export default App;
