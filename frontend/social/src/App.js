import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import React from 'react'
import Login from './pages/login';
import SignUp from './pages/signup';
import Profile from './pages/profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProtectRoutes from './components/protectRoutes';
import Post from './pages/posts';
import Chat from './components/friends';
import Requests from './components/friendRequists';
import NavBar from './components/Navbar';

function App() {
  return (
    <Router>
      <NavBar/>
      <div className='app'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/profile' element={
            <ProtectRoutes>
              < Profile/>
            </ProtectRoutes>
            } />
          {/* <Route path='/posts' element={
            <ProtectRoutes>
              < Post/>
            </ProtectRoutes>
            } /> */}
            <Route path='/chat' element={<Chat/>} />
            <Route path='/requests' element={<Requests/>} />
          <Route path='/navbar' element={<NavBar/>} />
          <Route path='*' element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
