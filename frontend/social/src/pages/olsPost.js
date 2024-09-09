import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, ListGroup, Button, Container, Row, Col, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './post.css';

const Post = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);
  const [reactionTypes] = useState(['Like', 'Haha', 'Love', 'Dislike']); // Reaction types
  const [hoveredReaction, setHoveredReaction] = useState(null); // Track hovered reaction
  const [newComment, setNewComment] = useState(''); // For adding new comments
  // const [commentId, setCommentId] = useState(''); // For removing comments
  const [myComments, setMyComments] = useState([]); // For getting my comments

  const getPosts = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:3001/posts', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setPosts(response.data.data); // Set posts data
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  useEffect(() => {
    getPosts();
  }, []);
  
  // Function to add a comment
  const addComment = async (postId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        `http://localhost:3001/posts/${postId}/comments`,
        { text: newComment },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNewComment(''); // Clear the input after comment is added
      // setCommentId(response.data.data.id);
      getPosts(); // Refresh posts to see the new comment
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Function to remove a comment
  const removeComment = async (commentId) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:3001/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      getPosts(); // Refresh posts to remove comment
    } catch (error) {
      console.error('Error removing comment:', error.msg);
    }
  };
  const getMyComments = async (postId) => {
    try{
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3001/comments/my-comments/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyComments(response.data.data);
      console.log(response.data.data);

    }catch(err){
      res.status(500).json({
          success: false,
          msg: err.message
      })
  }
};

  // Function to update a comment
  const updateComment = async (commentId, text) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3001/comments/${commentId}`, { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      getPosts(); // Refresh posts to see updated comment
    } catch (err) {
      console.log(err.message);
    }
  };

  // Function to react to a post
  const reactToPost = async (postId, reactionType) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `http://localhost:3001/posts/${postId}/likes`,
        { type: reactionType },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      getPosts(); // Refresh posts to update likes
    } catch (error) {
      console.error('Error reacting to post:', error.message);
    }
  };

  // Function to remove a like
  const removeLike = async (likeId) => {
    const token = localStorage.getItem('token');
    console.log('likeId:', likeId);
    try {
      console.log(likeId);
      await axios.delete(`http://localhost:3001/likes/${likeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      getPosts(); // Refresh posts to remove like
    } catch (error) {
      console.error('Error removing like:', error.message);
    }
  };
  const getMyLike = async (postId) => {
    const token = localStorage.getItem('token');
    console.log(postId);
    try {
      const response = await axios.get(`http://localhost:3001/likes/my-like/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await removeLike(response.data.data._id);
    } catch (error) {
      console.error('Error fetching my like:', error);
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

  return (
    <div className="post-container">
      <Container>
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
                  </Card.Body>
                  <ListGroup className="list-group-flush">
                    <ListGroup.Item className="likes">
                      Likes: {post.likes.length}
                    </ListGroup.Item>

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
                        <Dropdown.Item onClick={() => getMyLike(post._id)}>Removeee Like</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                    <Button
                      variant="outline-primary"
                      className="comment-button"
                      onClick={() => toggleComments(post._id)}
                    >
                      {expandedPost === post._id ? 'Hide Comments' : 'Show Comments'}
                    </Button>

                    {expandedPost === post._id && (
                      <ListGroup className="comments-section">
                        <ListGroup.Item className="comment-header">
                          Comments ({post.comments.length})
                        </ListGroup.Item>
                        {post.comments.length > 0 ? (
                          post.comments.map((comment) => (
                            <ListGroup.Item key={comment._id} className="comment-item">
                              <div className="comment-text">{comment.text}</div>
                              <div className="comment-date">
                                {new Date(comment.created).toLocaleString()}
                              </div>
                              <Button onClick={() => removeComment(comment._id)}>Remove</Button>
                              <Button onClick={() => updateComment(comment._id, 'Updated comment text')}>
                                Update
                              </Button>
                            </ListGroup.Item>
                          ))
                        ) : (
                          <ListGroup.Item className="no-comments">
                            No comments available.
                          </ListGroup.Item>
                        )}
                        <input
                          type="text"
                          placeholder="Write a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        />
                        <Button onClick={() => addComment(post._id)}>Add Comment</Button>
                      </ListGroup>
                    )}
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
