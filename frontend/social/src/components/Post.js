import React, { useState, useCallback , useEffect} from 'react';
import { Button, Card, Row, Col, Dropdown } from 'react-bootstrap';
import axios from 'axios';

const Post = ({ post, token, refreshPosts }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [hoveredReaction, setHoveredReaction] = useState(null);
  const [posts, setPosts] = useState([]);

  // Toggle the visibility of comments
  const toggleComments = () => setShowComments(!showComments);

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

  // Add a comment
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
  useEffect(() => {
    getPosts();
  }, [posts]);

  return (
    <Card className="mb-4" style={{ width: '60%' }}>
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
              </div>
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
              <Card.Text key={comment._id}>{comment.text}</Card.Text>
            ))}
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
  );
};

export default Post;
