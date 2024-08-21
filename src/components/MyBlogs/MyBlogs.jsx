import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import './MyBlogs.css';

function MyBlogs() {
  const { token, userId } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    if (token) {
      fetch('https://blog-backend-xlw9.onrender.com/posts/blogs/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setPosts(data))
        .catch((error) => console.error('Error fetching posts:', error));
    }
  }, [token]);

  const handleEdit = (postId) => {
    navigate(`/edit/${postId}`); // Use navigate for redirection
  };

  const handleDelete = (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      fetch(`https://blog-backend-xlw9.onrender.com/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setPosts(posts.filter(post => post._id !== postId));
          } else {
            console.error('Error deleting post');
          }
        })
        .catch((error) => console.error('Error:', error));
    }
  };

  return (
    <div className="blog-list-container">
      <h2 className="blog-list-title">My Blogs</h2>
      {posts.length > 0 ? (
        <div className="blog-tiles">
          {posts.map((post) => (
            <div key={post._id} className="blog-tile">
              <div className="blog-image-container">
                <img src={post.FeaturedImageURL || '/default-image.jpg'} alt="Blog" className="blog-image" />
                <span className="blog-category-label">{post.Category}</span>
              </div>
              <div className="blog-meta">
                <span className="blog-date">{new Date(post.PostDate).toLocaleDateString()}</span>
                <span className="blog-read-time">{post.ReadTime} mins</span>
              </div>
              <h3 className="blog-title">{post.Title}</h3>
              <p className="blog-excerpt">{post.Excerpt.split('\n')[0]}...</p>
              <div className="blog-actions">
                    <button onClick={() => handleEdit(post._id)} className="edit-button">Edit</button>
                    <button onClick={() => handleDelete(post._id)} className="delete-button">Delete</button>
              </div>
              <Link to={`/posts/${post._id}`} className="read-more-link">Read More</Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-blogs">No blogs found.</p>
      )}
    </div>
  );
}

export default MyBlogs;
