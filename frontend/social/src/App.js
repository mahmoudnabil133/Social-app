import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import React from 'react'
import Login from './pages/login';
import SignUp from './pages/signup';
import Profile from './pages/profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectRoutes from './components/protectRoutes';
import Chat from './components/friends';
import Requests from './components/friendRequists';
import NavBar from './components/Navbar';
import UserSetting from './pages/userSettings';

function App() {
  return (
    <Router>
      <NavBar/>
      <div className='app'>
        <Routes>
          <Route path='/' element={<ProtectRoutes><Home/></ProtectRoutes>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/profile/:userId' element={
            <ProtectRoutes>
              < Profile/>
            </ProtectRoutes>
            } />
            <Route path='/chat' element={<ProtectRoutes><Chat/></ProtectRoutes>} />
            <Route path='/requests' element={<ProtectRoutes><Requests/></ProtectRoutes>} />

          <Route path='/user-settings' element={
            <ProtectRoutes>
              < UserSetting/>
            </ProtectRoutes>
            } />
          <Route path='*' element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
