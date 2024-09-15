import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import Post from '../components/Post';
import './profile.css'; // Link to the CSS file

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();
  const token = localStorage.getItem('token');

  const getProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data.data);
    } catch (err) {
      alert('Failed to get profile');
    }
  };

  const getUserPosts = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/posts/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(res.data.data);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    }
  };

  useEffect(() => {
    getProfile();
    getUserPosts();
  }, [userId]);

  return (
    <div className="profile-container">
      {profile && (
        <div className="profile-header">
          <img src={`http://localhost:3001/${profile.photoUrl}`} alt="User Profile" className="profile-photo" />
          <div className="profile-details">
            <h2>{profile.userName}</h2>
            <h4>{profile.email}</h4>
            {profile.bio && <p>{profile.bio}</p>}
            {/* <Button variant="primary" onClick={() => navigate('/edit-profile')}>
              Edit Profile
            </Button> */}
          </div>
        </div>
      )}

      <div className="user-posts">
        <h2 className="posts-title">Posts</h2>
        <Row className="justify-content-center">
          {posts.length > 0 ? (
            posts.map(post => (
              <Col xs={12} md={10} lg={8} key={post._id} className="mb-4">
                <Post post={post} token={token} refreshPosts={getUserPosts} />
              </Col>
            ))
          ) : (
            <Alert variant="info">No posts available</Alert>
          )}
        </Row>
      </div>
    </div>
  );
};

export default Profile;
