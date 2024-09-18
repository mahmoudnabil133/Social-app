import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './requests.css'; // Ensure to have this CSS for additional styling

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [recommendedFriends, setRecommendedFriends] = useState([]);
  const [clickedFriends, setClickedFriends] = useState([]); // Track clicked friends
  const token = localStorage.getItem('token');

  // Fetch current user's friend requests
  const getMyAccount = async () => {
    try {
      const response = await axios.get('https://www.mahmoudnabil.tech/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRequests(response.data.data.friendRequists);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch recommended friends
  const getRecommendedFriends = async () => {
    try {
      const response = await axios.get(`https://www.mahmoudnabil.tech/api/users/recommended-friends`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRecommendedFriends(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Send a friend request
  const sendRequest = async (toBeFriendId) => {
    try {
      const response = await axios.post(`https://www.mahmoudnabil.tech/api/users/friend-requist/${toBeFriendId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.message);
      setClickedFriends((prevClicked) => [...prevClicked, toBeFriendId]); // Mark as clicked
    } catch (err) {
      console.log(err);
    }
  };

  // Accept a friend request
  const acceptRequest = async (requestingUserId) => {
    try {
      const response = await axios.post(`https://www.mahmoudnabil.tech/api/users/accept-friend-requist/${requestingUserId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.message);
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestingUserId)); // Remove request from the list
    } catch (err) {
      console.log(err);
    }
  };

  // Decline a friend request
  const declineRequest = async (requestingUserId) => {
    try {
      const response = await axios.post(`https://www.mahmoudnabil.tech/api/users/decline-friend-requist/${requestingUserId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.message);
      setRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestingUserId)); // Remove request from the list
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMyAccount();
    getRecommendedFriends();
  }, []);

  return (
    <div className="requests-container">
      <h1>Friend Requests</h1>
      <div className="friend-requests">
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request._id} className="request-card">
              <p>{request.userName}</p>
              <button className="accept-btn" onClick={() => acceptRequest(request._id)}>Accept</button>
              <button className="decline-btn" onClick={() => declineRequest(request._id)}>Decline</button>
            </div>
          ))
        ) : (
          <p>No friend requests.</p>
        )}
      </div>

      <h2>Recommended Friends</h2>
      <div className="recommended-friends">
        {recommendedFriends.length > 0 ? (
          recommendedFriends.map((friend) => (
            <div key={friend._id} className="recommended-card">
              <p>{friend.userName}</p>
              <button
                className={`add-friend-btn ${clickedFriends.includes(friend._id) ? 'clicked' : ''}`}
                onClick={() => sendRequest(friend._id)}
                disabled={clickedFriends.includes(friend._id)} // Disable button after clicking
              >
                {clickedFriends.includes(friend._id) ? 'Friend Added' : 'Add Friend'}
              </button>
            </div>
          ))
        ) : (
          <p>No recommended friends available.</p>
        )}
      </div>
    </div>
  );
};

export default Requests;
