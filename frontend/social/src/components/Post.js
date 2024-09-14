import React, { useState, useCallback, useEffect } from 'react';
import { Button, Card, Row, Col, Dropdown } from 'react-bootstrap';
import axios from 'axios';

const Post = ({ post, token, refreshPosts }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [hoveredReaction, setHoveredReaction] = useState(false);
  const [posts, setPosts] = useState([]);
  const [commentAdded, setCommentAdded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showActions, setShowActions] = useState(false); // For toggling update/delete buttons
  const [showActionsForComment, setShowActionsForComment] = useState(null); // State to track which comment's dropdown is open

  // Toggle the visibility of comments
  const toggleComments = () => setShowComments(!showComments);
  const toggleActions = () => setShowActions(!showActions);

  // Function to close the dropdown if clicked outside
  const closeActions = () => setShowActions(false);

  // Handle reactions
  const handleReaction = async (type) => {
    try {
      await axios.post(`http://localhost:3001/posts/${post._id}/likes`, { type }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshPosts();
    } catch (error) {
      console.error('Error reacting to post:', error);
    }
  };

  // Get current user
  const getMe = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUserId(res.data.data._id);
    } catch (err) {
      console.log('Error getting user details:', err.message);
    }
  };

  // Add a comment
  const addComment = async (postId) => {
    try {
      await axios.post(
        `http://localhost:3001/posts/${postId}/comments`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewComment(''); // Clear the input after comment 
      getPosts(); // Refresh posts to see the new comment
      setCommentAdded(true);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const updatePost = () => {
    // Update post logic
    // setShowActions(false);
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:3001/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshPosts();
    } catch (err) {
      console.log('Error deleting post:', err);
    }
  };

  const updateComment = () => {
    // Update comment logic
    // setShowActions(false);
  };

  const deleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshPosts();
    } catch (err) {
      console.log('Error deleting comment:', err);
    }
  };

  // Get posts
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

  // Function to toggle dropdown for a specific comment
  const toggleActionsForComment = (commentId) => {
    setShowActionsForComment(prevState => (prevState === commentId ? null : commentId));
  };

  useEffect(() => {
    if (commentAdded) {
      refreshPosts();
      setCommentAdded(false);
    }
    getMe();
  }, [commentAdded]);

  return (
    <div className="d-flex justify-content-center mb-4">
      <Card style={{ width: '60%' }}>
        <Card.Body>
          <div className="d-flex align-items-start mb-2">
            {/* Check if postedBy exists before rendering */}
            {post.postedBy && (
              <>
                {post.postedBy.photoUrl && (
                  <img
                    src={`http://localhost:3001/${post.postedBy.photoUrl}`}
                    alt={post.postedBy.userName}
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px', objectFit: 'cover', marginRight: '10px' }}
                  />
                )}
                <div>
                  <strong>{post.postedBy.userName}</strong>
                  {/* Display post time in light black color */}
                  <div style={{ color: '#666', fontSize: '0.9em' }}>
                    {new Date(post.created).toLocaleString()}
                  </div>
                </div>
                {/* Show "three dots" dropdown for the post author */}
                {post.postedBy && post.postedBy._id === currentUserId && (
                  <Dropdown className="ml-auto" alignRight show={showActions} onToggle={setShowActions}>
                    <Dropdown.Toggle
                      variant="link"
                      id="dropdown-basic"
                      onClick={toggleActions}
                    >
                      •••
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => { updatePost(post._id); closeActions(); }}>Update</Dropdown.Item>
                      <Dropdown.Item onClick={() => { deletePost(post._id); closeActions(); }}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </>
            )}
          </div>

          <Card.Title>{post.title}</Card.Title>
          <Card.Text>{post.body}</Card.Text>
          {post.photoUrl && (
            <Card.Img
              variant="top"
              src={`http://localhost:3001/${post.photoUrl}`}
              style={{ width: '100%', height: 'auto' }}
            />
          )}
          
          <Row className="mt-3">
            <Col>
              <div className="d-flex flex-column align-items-start">
                <span>👍 {post.likes.length} Likes</span>
                <Dropdown onMouseEnter={() => setHoveredReaction(true)} onMouseLeave={() => setHoveredReaction(false)}>
                  <Dropdown.Toggle variant="link" id="dropdown-basic">
                    React
                  </Dropdown.Toggle>
                  <Dropdown.Menu show={hoveredReaction}>
                    {['Like', 'Haha', 'Love', 'Dislike'].map(reaction => (
                      <Dropdown.Item key={reaction} onClick={() => handleReaction(reaction)}>{reaction}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
            <Col>
              <Button variant="link" onClick={toggleComments}>
                💬 Comments ({post.comments.length})
              </Button>
            </Col>
          </Row>

          {showComments && (
          <div className="mt-3">
            {post.comments.map(comment => (
              <div key={comment._id} style={{ position: 'relative' }}>
                <Card.Text>{comment.text}</Card.Text>
                
                {/* Display comment date in light black color */}
                <div style={{ color: '#666', fontSize: '0.8em' }}>
                  {new Date(comment.created).toLocaleString()}
                </div>

                {/* If the comment is posted by the current user, show the 3 dots dropdown */}
                {comment.postedBy && comment.postedBy === currentUserId && (
                  <Dropdown
                    className="ml-auto"
                    alignRight
                    show={showActionsForComment === comment._id} // Show dropdown only for the specific comment
                    onToggle={() => toggleActionsForComment(comment._id)}
                    style={{ position: 'absolute', top: '0', right: '0' }}
                  >
                    <Dropdown.Toggle
                      variant="link"
                      id="dropdown-basic"
                      style={{ padding: 0 }}
                    >
                      •••
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => { updateComment(comment._id); toggleActionsForComment(null); }}>Update</Dropdown.Item>
                      <Dropdown.Item onClick={() => { deleteComment(comment._id); toggleActionsForComment(null); }}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            ))}

            {/* Textarea for adding a new comment */}
            <textarea
              className="form-control mt-2"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
            />
            <Button className="mt-2" onClick={() => addComment(post._id)}>Comment</Button>
          </div>
        )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Post;
