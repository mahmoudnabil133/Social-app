import React, { useState, useCallback, useEffect } from 'react';
import { Button, Card, Row, Col, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
const Post = ({ post, token, refreshPosts }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState(false);
  const [posts, setPosts] = useState([]);
  const [commentAdded, setCommentAdded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showActions, setShowActions] = useState(false); // For toggling update/delete buttons
  const [showActionsForComment, setShowActionsForComment] = useState(null); // State to track which comment's dropdown is open
  const [postComments, setPostComments] = useState([]);

  // Toggle the visibility of comments
  const toggleComments = () => {
    setShowComments(!showComments);
    if (!showComments) {
      getPostComments(post._id); // Fetch comments when toggled
    }
  };

  const toggleActions = () => setShowActions(!showActions);

  // Function to close the dropdown if clicked outside
  const closeActions = () => setShowActions(false);

  // Handle reaction

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
      await getPostComments(postId); // Refresh comments after adding
      setCommentAdded(true);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const updatePost = () => {
    // Update post logic
    setShowActions(false);
  };

  const getPostComments = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:3001/posts/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPostComments(res.data.data);
    } catch (err) {
      console.log(err);
    }
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
    setShowActionsForComment(null);
  };

  const deleteComment = async (commentId, postId) => {
    try {
      await axios.delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // await getPostComments(postId); // Refresh comments after deleting
      setPostComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
      refreshPosts();
    } catch (err) {
      console.log('Error deleting comment:', err);
    }
  };

  // Get posts
  const removeLike = async (postId) => {
    try {
      const res = await axios.get(`http://localhost:3001/likes/my-like/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const likeId = res.data.data._id;
      await axios.delete(`http://localhost:3001/likes/${likeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshPosts();
    } catch (err) {
      console.log('Error deleting like:', err);
    }
  };
  const likePost = async (postId) => {
    try {
      await axios.post(`http://localhost:3001/posts/${postId}/likes`, { type: 'Like' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      refreshPosts();
    } catch (err) {
      console.log('Error liking post:', err);
    }
  }

  // Function to toggle dropdown for a specific comment
  const toggleActionsForComment = (commentId) => {
    setShowActionsForComment(prevState => (prevState === commentId ? null : commentId));
  };
  const handleLikeClick = async () => {
    if (liked) {
      await removeLike(post._id);
    } else {
      await likePost(post._id);
    }
    // Update the liked state after the like/unlike action
    setLiked(!liked);
  };
  useEffect(() => {
    const userHasLiked = post.likes.some(like => like.user === currentUserId);
    setLiked(userHasLiked);
    if (commentAdded) {
      refreshPosts();
      setCommentAdded(false);
    }
    getMe();
  }, [commentAdded, refreshPosts, post.likes, currentUserId]);

  return (
    <>
      <div className="d-flex justify-content-center mb-4">
        <Card style={{ width: '60%' }}>
          <Card.Body>
            <div className="d-flex align-items-start mb-2">
              {post.postedBy && (
                <>
                  {post.postedBy.photoUrl && (
                    <Link to={`/profile/${post.postedBy._id}`}>
                      <img
                        src={`http://localhost:3001/${post.postedBy.photoUrl}`}
                        alt={post.postedBy.userName}
                        className="rounded-circle"
                        style={{
                          width: '40px',
                          height: '40px',
                          objectFit: 'cover',
                          marginRight: '10px',
                          cursor: 'pointer',
                        }}
                      />
                    </Link>
                  )}
                  <div>
                    <strong>{post.postedBy.userName}</strong>
                    <div style={{ color: '#666', fontSize: '0.9em' }}>
                      {new Date(post.created).toLocaleString()}
                    </div>
                  </div>
                  {post.postedBy._id === currentUserId && (
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
                <button
                  onClick={handleLikeClick}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: liked ? 'red' : 'black',
                    fontSize: '1.5em',
                  }}
                >
                  <FontAwesomeIcon icon={faHeart} />
                </button>
                <span>{post.likes.length}</span>
              </div>
            </Col>
              <Col>
                <Button variant="link" onClick={toggleComments}>
                  💬 Comments ({post.comments.length})
                </Button>
              </Col>
            </Row>

            {showComments && (
              <div className="comment-container mt-3">
                {postComments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <div className="comment-user-details">
                      {comment.postedBy && (
                        <>
                          {comment.postedBy.photoUrl && (
                            <Link to={`/profile/${comment.postedBy._id}`}>
                              <img
                                src={`http://localhost:3001/${comment.postedBy.photoUrl}`}
                                alt={comment.postedBy.userName}
                                className="rounded-circle"
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  objectFit: 'cover',
                                  marginRight: '10px',
                                }}
                              />
                            </Link>
                          )}
                          <div>
                            <strong>{comment.postedBy.userName}</strong>
                            <div style={{ color: '#666', fontSize: '0.8em' }}>
                              {new Date(comment.created).toLocaleString()}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <Card.Text className="comment-text">{comment.text}</Card.Text>

                    {comment.postedBy._id === currentUserId && (
                      <Dropdown
                        className="ml-auto"
                        alignRight
                        show={showActionsForComment === comment._id}
                        onToggle={() => toggleActionsForComment(comment._id)}
                      >
                        <Dropdown.Toggle variant="link" id="dropdown-basic">
                          •••
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => { updateComment(comment._id); toggleActionsForComment(null); }}>Update</Dropdown.Item>
                          <Dropdown.Item onClick={() => { deleteComment(comment._id, post._id); toggleActionsForComment(null); }}>Delete</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                ))}

                <div className="comment-input-container d-flex mt-2">
                  <input
                    type="text"
                    className="form-control comment-input"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button variant="primary" className="comment-button" onClick={() => addComment(post._id)}>Comment</Button>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Post;
