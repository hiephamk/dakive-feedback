import React, { useState } from 'react';
import axios from 'axios';
import useAccessToken from '../../../services/token';
import { useSelector } from 'react-redux';

const HandleLike = ({setPosts}) => {
  const { user} = useSelector((state) => state.auth);
  const accessToken = useAccessToken(user);
  
  const [like, setLike] = useState({});

  const handleLike = async (postId) => {
    if (like[postId]) {
      return;
    }

    if (!accessToken) {
      console.error("Unable to fetch data: No valid access token.");
      return;
    }

    try {
      // Send a POST request to like the post.
      await axios.post(
        `http://127.0.0.1:8000/api/posts/${postId}/like/`,
        { like_count: 1 },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Update the liked posts state.
      setLike((prevLikedPosts) => ({
        ...prevLikedPosts,
        [postId]: true,
      }));

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, like_count: post.like_count + 1 } : post
        )
      );
    } catch (error) {
      console.error("Error liking the post:", error.response || error.message);
    }
  };

  return {like, handleLike}
};

export default HandleLike;
