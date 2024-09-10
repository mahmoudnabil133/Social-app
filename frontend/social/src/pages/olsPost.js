




import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Card, ListGroup, Button, Container, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './post.css';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [newImage, setNewImage] = useState(null); // Image file state
  const token = localStorage.getItem('token');

  const getPosts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data.data); // Set posts data
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [token]);

  useEffect(() => {
    getPosts();
  }, [getPosts]);

  // Handle form input change for post creation
  const handleInputChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  // Handle post creation with image upload
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
      getPosts(); // Refresh posts after adding new post
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <div className="post-container">
      <Container>
        <Row className="justify-content-center">
          {/* Form to create new post */}
          <Col xs={12} md={8} lg={6}>
            <Card className="post-card">
              <Card.Body>
                <h3>Create New Post</h3>
                <Form onSubmit={handleCreatePost}>
                  <Form.Group controlId="postTitle">
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

                  <Form.Group controlId="postBody">
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="body"
                      value={newPost.body}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Enter post body"
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="postImage">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleImageChange}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary">
                    Create Post
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* List of posts */}
        <Row className="justify-content-center">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Col key={post._id} xs={12} md={8} lg={6}>
                <Card className="post-card">
                  <Card.Body>
                    <Card.Subtitle className="post-date">
                      {new Date(post.created).toLocaleString()}
                    </Card.Subtitle>
                    <Card.Title className="post-title">{post.title}</Card.Title>
                    <Card.Text className="post-body">{post.body}</Card.Text>

                    {/* Display image if post has an image URL */}
                    {post.photoUrl && (
                      <img
                        src={`http://localhost:3001/${post.photoUrl}`}
                        alt="Post"
                        className="post-image"
                        style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
                      />
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No posts available</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Post;
