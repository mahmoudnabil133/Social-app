import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import Post from '../components/Post';  // Import the Post component
import BaseUrl from '../api/api';
import './postDetails.css';  // Import the CSS file

const PostDetails = () => {
  const { postId } = useParams();
  const token = localStorage.getItem('token');
  const [post, setPost] = useState({});
  const [error, setError] = useState('');

  // Fetch Post
  const getPost = async () => {
    try {
      const response = await axios.get(`${BaseUrl}/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPost(response.data.data);
    } catch (err) {
      console.error(err.message);
      setError('Error fetching the post details.');
    }
  };

  useEffect(() => {
    getPost(); // Fetch the post details when the component mounts
  }, [postId]);

  return (
    <Row className="justify-content-center post-details-container">
      {error ? (
        <Col xs={12}>
          <Alert variant="danger">{error}</Alert>
        </Col>
      ) : (
        <Col xs={12} md={10} lg={8} className="mb-4">
          {post && post._id ? (
            <Post post={post} token={token} refreshPosts={getPost} />
          ) : (
            <Alert variant="info">Loading post details...</Alert>
          )}
        </Col>
      )}
    </Row>
  );
};

export default PostDetails;
