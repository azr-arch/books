import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Navbar from "./pages/Navbar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Navbar />
      <ToastContainer />
    </LocalizationProvider>
  );
};

export default App;
