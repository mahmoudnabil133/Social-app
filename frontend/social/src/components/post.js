import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './post.css'; // Include your CSS styles here

const Post = () => {
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [hoveredLike, setHoveredLike] = useState('');

  const token = localStorage.getItem('token'); // Retrieve token from localStorage

  // Memoized getPost function
  const getPost = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3001/posts/66ddbd101391040848320bca', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPost(response.data.data);
      console.log(response)
    } catch (err) {
      console.error('Failed to fetch post', err);
    }
  }, [token]); // Add token as a dependency

  // Handle creating a new comment
  const handleCreateComment = async () => {
    if (!newComment) return;
    try {
      const response = await axios.post(
        `http://localhost:3001/posts/${post._id}/comments`,
        { text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPost((prevPost) => ({
        ...prevPost,
        comments: [...prevPost.comments, response.data.data],
      }));
      setNewComment('');
    } catch (err) {
      console.error('Failed to create comment', err);
    }
  };

  // Handle like/dislike/love/haha interactions using PATCH
  const handleLike = async (type) => {
    try {
      const existingLike = post.likes.find((like) => like.user === "66dc5312503dc70fadb62b35"); // Replace with actual user ID
      if (existingLike) {
        // Update existing like with PATCH method
        await axios.patch(
          `http://localhost:3001/likes/${existingLike._id}`,
          { type },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // Create a new like
        await axios.post(
          `http://localhost:3001/posts/${post._id}/likes`,
          { type },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      getPost(); // Refresh post data
    } catch (err) {
      console.error('Failed to handle like', err);
    }
  };

  useEffect(() => {
    getPost();
  }, [getPost]); // Add getPost to the dependency array

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-container">
      <h1>{post.title}</h1>
      <p>{post.body}</p>

      <div className="post-actions">
        <div className="likes-section">
          <span>{post.likes.length} Likes</span>
          <button
            className={`like-button ${hoveredLike === 'Like' ? 'active' : ''}`}
            onMouseEnter={() => setHoveredLike('Like')}
            onMouseLeave={() => setHoveredLike('')}
            onClick={() => handleLike('Like')}
          >
            {hoveredLike === 'Like' ? '👍' : '👍'}
          </button>
          <button
            className={`like-button ${hoveredLike === 'Dislike' ? 'active' : ''}`}
            onMouseEnter={() => setHoveredLike('Dislike')}
            onMouseLeave={() => setHoveredLike('')}
            onClick={() => handleLike('Dislike')}
          >
            {hoveredLike === 'Dislike' ? '👎' : '👎'}
          </button>
          <button
            className={`like-button ${hoveredLike === 'Love' ? 'active' : ''}`}
            onMouseEnter={() => setHoveredLike('Love')}
            onMouseLeave={() => setHoveredLike('')}
            onClick={() => handleLike('Love')}
          >
            {hoveredLike === 'Love' ? '❤️' : '❤️'}
          </button>
          <button
            className={`like-button ${hoveredLike === 'Haha' ? 'active' : ''}`}
            onMouseEnter={() => setHoveredLike('Haha')}
            onMouseLeave={() => setHoveredLike('')}
            onClick={() => handleLike('Haha')}
          >
            {hoveredLike === 'Haha' ? '😂' : '😂'}
          </button>
        </div>

        <div className="comments-section">
          <span>{post.comments.length} Comments</span>
          <ul>
            {post.comments.map((comment) => (
              <li key={comment._id}>
                <p>{comment.text}</p>
                {/* Add edit/delete functionality here */}
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={handleCreateComment}>Post Comment</button>
        </div>
      </div>
    </div>
  );
};

export default Post;
