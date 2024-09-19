import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faUserGroup, faComment, faRightToBracket, faBell } from '@fortawesome/free-solid-svg-icons';
import './Navbar.css'; // Link to your custom CSS file for styling
import BaseUrl from '../api/api';
import axios from 'axios';

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [status, setStatus] = useState(false); // status for unread notifications
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const token = localStorage.getItem('token');

  const isUnReadNot = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/notifications/isunread`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStatus(res.data.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleLogout = () => {
    // Clear user authentication data and navigate to login or home page
    localStorage.removeItem('token');
    navigate('/login');
  };

  const userId = localStorage.getItem('userId');
  const photoUrl = localStorage.getItem('photoUrl');

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    isUnReadNot(); // Fetch the unread notifications status on mount
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [status]);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">SocialApp</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/"><FontAwesomeIcon icon={faHouse} className="nav-icon" /> Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chat"><FontAwesomeIcon icon={faComment} className="nav-icon" /> Chat</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/requests"><FontAwesomeIcon icon={faUserGroup} className="nav-icon" /> Requests</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/notifications">
                <div className="icon-container">
                  <FontAwesomeIcon icon={faBell} className="nav-icon" />
                  {status && <span className="notification-dot"></span>}
                </div>
                Notifications
              </Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown" ref={dropdownRef}>
              <button
                className="nav-link dropdown-toggle profile-photo-btn"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={`${BaseUrl}/${photoUrl}`} // Fallback to a default image if no photoUrl
                  alt="Profile"
                  className="profile-photo"
                />
              </button>
              {isDropdownOpen && (
                <ul className="dropdown-menu show dropdown-menu-end">
                  <li><Link className="dropdown-item" to={`/profile/${userId}`}>Profile</Link></li>
                  <li><Link className="dropdown-item" to="/user-settings">Settings</Link></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                </ul>
              )}
            </li>
            <li className="nav-item">
              <Link className="nav-link login-btn" to="/login"><FontAwesomeIcon icon={faRightToBracket} className="nav-icon" /> Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
