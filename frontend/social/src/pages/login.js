import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';  // Assuming you will create this CSS file

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post('https://www.mahmoudnabil.tech/api/users/login', { email, password });
      response = response.data;
      localStorage.clear();
      localStorage.setItem('token', response.token);
      localStorage.setItem('userId', response.data._id);
      localStorage.setItem('photoUrl', response.data.photoUrl);
      alert('Login successful');
      // window.location.reload();

      navigate('/');
    } catch (err) {
      console.log(err);
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Login</h1>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <button type="submit" className="login-btn">Login</button>
        </form>
        <div className="login-footer">
          <p>Don't have an account? <Link to="/signup" className="signup-link">Sign up here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
