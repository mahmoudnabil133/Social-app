import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Post from '../components/Post';  // import the Post component
import { Container, Row, Col, Spinner, Alert, Button, Form, Modal } from 'react-bootstrap';
import './style.css'; // Import the custom styles

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false); // To toggle the create post form
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [newImage, setNewImage] = useState(null);
  const token = localStorage.getItem('token');

  const getPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3001/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data.data); // Set posts data
    } catch (error) {
      setError('Error fetching posts. Please try again later.');
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  const handleInputChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', newPost.title);
    formData.append('body', newPost.body);
    if (newImage) {
      formData.append('photo', newImage);
    }

    try {
      await axios.post('http://localhost:3001/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      setNewPost({ title: '', body: '' });
      setNewImage(null);
      setShowCreatePost(false); // Close the form after submission
      getPosts(); // Refresh posts after adding new post
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <Container fluid className="home-container my-4">
      <Button 
        variant="primary" 
        className="mb-4"
        onClick={() => setShowCreatePost(true)}
      >
        Create Post
      </Button>

      {/* {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : ( */}
        <>
          <Row className="justify-content-center">
            {posts.length > 0 ? (
              posts.map(post => (
                <Col xs={12} md={10} lg={8} key={post._id} className="mb-4">
                  <Post post={post} token={token} refreshPosts={getPosts} />
                </Col>
              ))
            ) : (
              <Alert variant="info">No posts available</Alert>
            )}
          </Row>

          {/* Create Post Form Modal */}
          <Modal show={showCreatePost} onHide={() => setShowCreatePost(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Create New Post</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleCreatePost}>
                <Form.Group controlId="formPostTitle">
                  <Form.Label>Title</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="title" 
                    value={newPost.title} 
                    onChange={handleInputChange} 
                    placeholder="Enter post title" 
                    required 
                  />
                </Form.Group>
                <Form.Group controlId="formPostBody">
                  <Form.Label>Body</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={3} 
                    name="body" 
                    value={newPost.body} 
                    onChange={handleInputChange} 
                    placeholder="Enter post body" 
                    required 
                  />
                </Form.Group>
                <Form.Group controlId="formPostImage">
                  <Form.Label>Image (optional)</Form.Label>
                  <Form.Control 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange} 
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Create Post
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>
    </Container>
  );
};

export default Home;
