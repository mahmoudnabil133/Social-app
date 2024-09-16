import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Link to your custom CSS file for styling

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/chat">Chat</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/requests">Requests</Link>
            </li>
          </ul>

          <ul className="navbar-nav ms-auto"> {/* Move to the right */}
            <li className="nav-item dropdown" ref={dropdownRef}>
              <button
                className="nav-link dropdown-toggle profile-photo-btn"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={`www.mahmoudnabil.tech:3001/${photoUrl}`} // Fallback to a default image if no photoUrl
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
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
