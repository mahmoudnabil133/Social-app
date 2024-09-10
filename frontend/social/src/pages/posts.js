import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Card, ListGroup, Button, Container, Row, Col, Dropdown , Form} from 'react-bootstrap';
import { FaEllipsisV, FaTrashAlt, FaEdit } from 'react-icons/fa'; // Import icons
import 'bootstrap/dist/css/bootstrap.min.css';
import './post.css';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [reactionTypes] = useState(['Like', 'Haha', 'Love', 'Dislike']); // Reaction types
  const [hoveredReaction, setHoveredReaction] = useState(null); // Track hovered reaction
  const [newComment, setNewComment] = useState(''); // For adding new comments
  const [userComments, setUserComments] = useState([]); // For storing user comments
  const [newPost, setNewPost] = useState({ title: '', body: '' });
  const [newImage, setNewImage] = useState(null); // Image file state

  const token = localStorage.getItem('token');

  const getPosts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data.data); // Set posts data
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [token]);

  const getMyComments = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/comments/my-comments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserComments(response.data.data); // Set user comments
    } catch (error) {
      console.error('Error fetching my comments:', error);
    }
  }, [token]);

  useEffect(() => {
    getPosts();
    getMyComments();
  }, [getPosts, getMyComments]); // Include getPosts and getMyComments as dependencies

  // Function to add a comment
  const addComment = async (postId) => {
    try {
      await axios.post(
        `http://localhost:3001/posts/${postId}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment(''); // Clear the input after comment is added
      getPosts(); // Refresh posts to see the new comment
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Function to remove a comment
  const removeComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      getPosts(); // Refresh posts to remove comment
      getMyComments(); // Refresh user's comments
    } catch (error) {
      console.error('Error removing comment:', error.message);
    }
  };

  // Function to update a comment
  const updateComment = async (commentId, text) => {
    try {
      await axios.patch(`http://localhost:3001/comments/${commentId}`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      getPosts(); // Refresh posts to see updated comment
      getMyComments(); // Refresh user's comments
    } catch (err) {
      console.error('Error updating comment:', err.message);
    }
  };

  // Function to react to a post
  const reactToPost = async (postId, reactionType) => {
    try {
      await axios.post(
        `http://localhost:3001/posts/${postId}/likes`,
        { type: reactionType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      getPosts(); // Refresh posts to update likes
    } catch (error) {
      console.error('Error reacting to post:', error.message);
    }
  };

  // Function to remove a like
  const removeLike = async (likeId) => {
    try {
      await axios.delete(`http://localhost:3001/likes/${likeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      getPosts(); // Refresh posts to remove like
    } catch (error) {
      console.error('Error removing like:', error.message);
    }
  };

  // Toggle comments section
  const toggleComments = (postId) => {
    if (expandedPost === postId) {
      setExpandedPost(null); // Collapse comments if already expanded
    } else {
      setExpandedPost(postId); // Expand comments for the selected post
    }
  };
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

  // Function to render action buttons for user comments
  const renderActionButtons = (comment) => {
    return (
      <div className="comment-actions">
        <Button
          variant="link"
          onClick={() => updateComment(comment._id, 'Updated comment text')}
          className="action-button"
        >
          <FaEdit />
        </Button>
        <Button
          variant="link"
          onClick={() => removeComment(comment._id)}
          className="action-button"
        >
          <FaTrashAlt />
        </Button>
      </div>
    );
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
                    {post.photoUrl && (
                      <img
                        src={`http://localhost:3001/${post.photoUrl}`}
                        alt="Post"
                        className="post-image"
                        style={{ width: '100%', height: 'auto', maxHeight: '300px', objectFit: 'cover' }}
                      />
                    )}
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item className="post-actions">
                      <div className="likes">
                        Likes: {post.likes.length}
                      </div>
                      <Dropdown
                        onMouseEnter={() => setHoveredReaction(post._id)}
                        onMouseLeave={() => setHoveredReaction(null)}
                      >
                        <Dropdown.Toggle variant="outline-primary" className="reaction-button">
                          {hoveredReaction === post._id ? 'Choose Reaction' : 'React'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {reactionTypes.map((reaction) => (
                            <Dropdown.Item
                              key={reaction}
                              onClick={() => reactToPost(post._id, reaction)}
                            >
                              {reaction}
                            </Dropdown.Item>
                          ))}
                          <Dropdown.Item onClick={() => removeLike(post._id)}>Remove Like</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </ListGroup.Item>

                    <ListGroup.Item className="comments-section">
                      <Button
                        variant="outline-primary"
                        className="comment-button"
                        onClick={() => toggleComments(post._id)}
                      >
                        {expandedPost === post._id ? 'Hide Comments' : 'Show Comments'}
                      </Button>

                      {expandedPost === post._id && (
                        <>
                          <ListGroup className="comments-list">
                            {post.comments.length > 0 ? (
                              post.comments.map((comment) => (
                                <ListGroup.Item key={comment._id} className="comment-item">
                                  <div className="comment-text">{comment.text}</div>
                                  <div className="comment-date">
                                    {new Date(comment.created).toLocaleString()}
                                  </div>
                                  {userComments.some((userComment) => userComment._id === comment._id) && (
                                    <div className="comment-actions">
                                      <FaEllipsisV
                                        onClick={() => renderActionButtons(comment)}
                                        className="comment-menu-icon"
                                      />
                                      {renderActionButtons(comment)}
                                    </div>
                                  )}
                                </ListGroup.Item>
                              ))
                            ) : (
                              <ListGroup.Item className="no-comments">
                                No comments available.
                              </ListGroup.Item>
                            )}
                          </ListGroup>
                          <input
                            type="text"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                          />
                          <Button onClick={() => addComment(post._id)}>Add Comment</Button>
                        </>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
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
