import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import Post from '../components/Post';
import './profile.css'; // Link to the CSS file

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newImage, setNewImage] = useState(null); // For storing the new profile image
  const [bio, setBio] = useState(''); // Bio input
  const [isEditingBio, setIsEditingBio] = useState(false); // Toggle bio editing
  const [uploadError, setUploadError] = useState(''); // Error for image upload
  const [loading, setLoading] = useState(false); // Loading state for save operation
  const navigate = useNavigate();
  const { userId } = useParams();
  const currentUserId= localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // Fetch Profile
  const getProfile = async () => {
    try {
      const response = await axios.get(`www.mahmoudnabil.tech:3001/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data.data);
      setBio(response.data.data.bio || ''); // Set initial bio
    } catch (err) {
      alert('Failed to get profile');
    }
  };

  // Combine Bio and Photo Update
  const updateMe = async () => {
    if (!profile) return;

    const formData = new FormData();

    // Append new image if available
    if (newImage) {
      formData.append('photo', newImage);
    }

    // Append new bio if it has changed
    if (bio !== profile.bio) {
      formData.append('bio', bio);
    }

    try {
      setLoading(true);
      const res = await axios.patch('www.mahmoudnabil.tech:3001/users/me', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data', // Required for file upload
        },
      });

      // Update profile with the new data
      setProfile(res.data.data);
      setNewImage(null); // Clear the image input
      setUploadError(''); // Clear any previous errors
      setIsEditingBio(false); // End editing
    } catch (err) {
      console.error(err.message);
      setUploadError('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle bio change
  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  // Fetch User Posts
  const getUserPosts = async () => {
    try {
      const res = await axios.get(`www.mahmoudnabil.tech:3001/posts/user/${userId}`, {
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
      {profile ? (
        <div className="profile-header">
          {/* Profile Image */}
          <form className="profile-photo-form">
            <label htmlFor="upload-photo">
              <img
                src={`www.mahmoudnabil.tech:3001/${profile.photoUrl}`}
                alt="User Profile"
                className={`profile-photo ${currentUserId === userId ? 'clickable' : ''}`} // Only clickable for current user
              />
            </label>
            {currentUserId === userId && (
              <input
                type="file"
                id="upload-photo"
                className="file-input"
                accept="image/*"
                onChange={(e) => setNewImage(e.target.files[0])}
                hidden
              />
            )}

            <div className="profile-details">
              <h2>{profile.userName}</h2>
              <h4>{profile.email}</h4>

              {/* Bio Section */}
              <div className="bio-section">
                {isEditingBio && currentUserId === userId ? (
                  <>
                    <textarea
                      className="bio-input"
                      value={bio}
                      onChange={handleBioChange}
                      placeholder="Add your bio..."
                    ></textarea>
                    <Button
                      type="button"
                      variant="primary"
                      className="update-btn"
                      onClick={updateMe}
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Bio'}
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="bio-text">{bio || 'No bio available'}</p>
                    {currentUserId === userId && (
                      <Button
                        variant="outline-primary"
                        className="edit-bio-btn"
                        onClick={() => setIsEditingBio(true)}
                      >
                        Edit Bio
                      </Button>
                    )}
                  </>
                )}
              </div>

              {/* Show Update Photo button only if it's the current user's profile */}
              {currentUserId === userId && (
                <Button
                  type="button"
                  variant="primary"
                  className="update-btn"
                  onClick={updateMe}
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Photo'}
                </Button>
              )}

              {uploadError && <Alert variant="danger">{uploadError}</Alert>}
            </div>
          </form>
        </div>
      ) : (
        <div className="loading-message">Loading profile...</div>
      )}

      <div className="user-posts">
        <h2 className="posts-title">Posts</h2>
        <Row className="justify-content-center">
          <Row className="justify-content-center flex-nowrap overflow-auto">
            <Row className="justify-content-center">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Col xs={12} key={post._id} className="mb-4">
                    <Post post={post} token={token} refreshPosts={getUserPosts} />
                  </Col>
                ))
              ) : (
                <Alert variant="info">No posts available</Alert>
              )}
            </Row>
          </Row>
        </Row>
      </div>
    </div>
  );
};

export default Profile;
