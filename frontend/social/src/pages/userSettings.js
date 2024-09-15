import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './userSettings.css';

const UserSetting = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // To display error message
  const [originalUserName, setOriginalUserName] = useState(''); // Original username from backend
  const [originalEmail, setOriginalEmail] = useState(''); // Original email from backend

  // Function to update user info
  const updateUser = async (e) => {
    e.preventDefault(); // Prevent form reload
    setError(''); // Clear any previous error message

    // Check what fields have changed
    const updatedData = {};
    if (userName !== originalUserName && userName.trim() !== '') {
      updatedData.userName = userName;
    }
    if (email !== originalEmail && email.trim() !== '') {
      updatedData.email = email;
    }

    // Don't proceed if no data has changed
    if (Object.keys(updatedData).length === 0) {
      setError('No changes made.');
      return;
    }

    try {
      const res = await axios.patch(
        `http://localhost:3001/users/me`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('User information updated successfully!');
      setTimeout(() => navigate('/'), 2000); // Redirect to home after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating user information.');
    }
  };

  // Function to update password
  const updatePassword = async (e) => {
    e.preventDefault(); // Prevent form reload
    setError(''); // Clear any previous error message
    try {
      const res = await axios.patch(
        `http://localhost:3001/users/updateMyPassword`,
        { passwordCurrent, password, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      localStorage.setItem('token', res.data.token); // Update token
      setMessage('Password updated successfully!');
      setTimeout(() => navigate('/home'), 2000); // Redirect to home after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating password.');
    }
  };

  // Function to delete account
  const deleteMe = async () => {
    setError(''); // Clear any previous error message
    try {
      await axios.delete(`http://localhost:3001/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage('Account deleted successfully!');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while deleting the account.');
    }
  };

  return (
    <div className="user-settings">
      <div className="user-settings-form">
        <h1>User Settings</h1>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>} {/* Show error message */}

        <div className="button-group">
          <button onClick={() => setShowUserForm(!showUserForm)} className="btn-toggle">
            {showUserForm ? 'Hide' : 'Update User Info'}
          </button>
          <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="btn-toggle">
            {showPasswordForm ? 'Hide' : 'Change Password'}
          </button>
          <button onClick={deleteMe} className="btn-delete">Delete Account</button>
        </div>

        {showUserForm && (
          <form onSubmit={updateUser} className="user-form">
            <div className="input-group">
              <input
                type="text"
                placeholder="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="btn-update">Update User</button>
          </form>
        )}

        {showPasswordForm && (
          <form onSubmit={updatePassword} className="password-form">
            <div className="input-group">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordCurrent}
                onChange={(e) => setPasswordCurrent(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-update">Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserSetting;
