import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path='/' element= {<Home/>} />
        <Route path='/register' element= {<Register/>} />
        <Route path='/login' element= {<Login/>} />
        <Route path='/add' element ={<AddItem/>} />
        <Route path='/edit/:id' element = {<EditItem/>} />
      </Routes>
      </BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
    </div>
  );
}

export default App;
