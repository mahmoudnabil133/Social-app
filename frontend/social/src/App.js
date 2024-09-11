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

function App() {
  return (
    <Router>
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
          <Route path='/posts' element={
            <ProtectRoutes>
              < Post/>
            </ProtectRoutes>
            } />
            <Route path='/chat' element={<Chat/>} />
          <Route path='*' element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
