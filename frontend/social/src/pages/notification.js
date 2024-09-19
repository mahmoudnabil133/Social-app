import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import './notification.css'; // You'll need to create this CSS file
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import BaseUrl from '../api/api';

// Connect to socket.io server
const socket = io.connect('http://localhost:3001', {
  auth: {
    token: localStorage.getItem('token'),
  },
});
const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');


  // Fetch notifications
  const getMyNotifications = async () => {
    try {
      const res = await axios.get(`${BaseUrl}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Mark notification as read
  const readNotification = async (notId, postId) => {
    try {
      await axios.patch(`${BaseUrl}/notifications/${notId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Navigate to post and refresh notifications
      navigate(`/posts/${postId}`);
      getMyNotifications();
    } catch (err) {
      console.log(err.message);
    }
  };

  // Delete notification
  const deleteNotification = async (notId) => {
    try {
      await axios.delete(`${BaseUrl}/notifications/${notId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Refresh notifications after deletion
      getMyNotifications();
    } catch (err) {
      console.log(err.message);
    }
  };

  // Socket listener for real-time notifications
  useEffect(() => {
    getMyNotifications();

    const receiveNotification = (data) => {
      console.log('Received new notification:', data);
      setNotifications((prevNotifications) => [data, ...prevNotifications]);
    };

    // Listen for notifications from the server
    socket.on('receive-notification', receiveNotification);

    return () => {
      socket.off('receive-notification', receiveNotification);
    };
  }, []);

  return (
    <div className="notifications-container">
      <h2>Your Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            className={`notification-item ${notification.read ? 'read' : 'unread'}`}
          >
            <div onClick={() => readNotification(notification._id, notification.postId)}>
              <p>{notification.message}</p>
              <span>{new Date(notification.date).toLocaleString()}</span>
            </div>
            <button className="delete-btn" onClick={() => deleteNotification(notification._id)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Notification;
