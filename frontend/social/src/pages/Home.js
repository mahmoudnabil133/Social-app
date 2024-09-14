import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Post from '../components/Post';  // import the Post component

const Home = () => {
  const [posts, setPosts] = useState([]);
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

  return (
    <div className="container d-flex justify-content-center">
      <div className="posts-container">
        {posts.map(post => (
          <Post key={post._id} post={post} token={token} refreshPosts={getPosts} />
        ))}
      </div>
    </div>
  );
};

export default Home;
