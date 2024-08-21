import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import './BlogDetails.css';

const BlogDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const { token } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`https://blog-backend-xlw9.onrender.com/posts/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(`https://blog-backend-xlw9.onrender.com/comments/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    const fetchUser = async () => {
      try {
        const response = await fetch('https://blog-backend-xlw9.onrender.com/auth/user', {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchPost();
    fetchComments();
    if (token) fetchUser();
  }, [id, token]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() && user) {
      try {
        const response = await fetch(`https://blog-backend-xlw9.onrender.com/comments/${id}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: newComment,
            userName: user.name,
            userProfilePic: user.profilePicture,
          }),
        });
        const data = await response.json();
        setComments([...comments, data]);
        setNewComment('');
      } catch (error) {
        console.error('Error posting comment:', error);
      }
    }
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  const formatTags = (tags) => {
    let tagsString = '';
  
    if (Array.isArray(tags)) {
      tagsString = tags.join(', ');
    } else if (typeof tags === 'string') {
      tagsString = tags;
    } else {
      console.error('Unexpected tags format:', tags);
      return [];
    }
  
    return tagsString
      .replace(/[\[\]"\s]/g, '')
      .split(',')
      .map(tag => tag.trim());
  };

  if (!post) return <div>Loading...</div>;

  const tags = post.Tags ? formatTags(post.Tags) : [];

  return (
    <div className="blog-detail-container">
      <div className="blog-detail-box">
        <img src={post.FeaturedImageURL} alt="Blog" className="blog-detail-image" />
        <h1 className="blog-detail-title">{post.Title}</h1>
        <div className="blog-detail-meta">
          <div className="blog-detail-author">
            <img 
              src={post.AuthorImageURL} 
              alt="Author" 
              className="author-photo" 
            />
            <span className="author-name">{post.AuthorName}</span>
          </div>
          <div className="blog-detail-right">
            <span className="blog-detail-date">{formatDate(post.PostDate)}</span>
            <span className="blog-detail-read-time">{post.ReadTime} mins read</span>
          </div>
        </div>
        <div className="blog-detail-content">
          <p>{post.Body}</p>
        </div>
        <div className="blog-detail-tags">
          {tags.length > 0 && (
            <div className="tags-container">
              {tags.map((tag, index) => (
                <span key={index} className="tag-bubble">{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="comment-section">
        <h3>Discussion</h3>
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            required
          />
          <button type="submit">Post Comment</button>
        </form>

        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment._id} className="comment">
              <img src={comment.userProfilePic} alt={comment.userName} />
              <div>
                <p>{comment.userName}</p>
                <p>{comment.text}</p>
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
