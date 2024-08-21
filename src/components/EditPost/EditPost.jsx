import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext';
import './EditPost.css'; // Ensure this file has similar styling to NewPost.css

function EditPost() {
  const { postId } = useParams();
  const { token } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    readTime: '',
    excerpt: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://blog-backend-xlw9.onrender.com/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setPost(data);
        setFormData({
          title: data.Title,
          body: data.Body,
          readTime: data.ReadTime,
          excerpt: data.Excerpt,
        });
      })
      .catch(error => console.error('Error fetching post:', error));
  }, [postId, token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    if (!formData.title.trim()) formErrors.title = 'Title is required';
    else if (formData.title.length < 5) formErrors.title = 'Title must be at least 5 characters long';

    if (!formData.body.trim()) formErrors.body = 'Body is required';
    else if (formData.body.length < 20) formErrors.body = 'Body must be at least 20 characters long';

    if (formData.readTime === '') formErrors.readTime = 'Read time is required';
    else if (isNaN(formData.readTime) || formData.readTime <= 0) formErrors.readTime = 'Read time must be a positive number';

    if (!formData.excerpt.trim()) formErrors.excerpt = 'Excerpt is required';
    else if (formData.excerpt.length < 10) formErrors.excerpt = 'Excerpt must be at least 10 characters long';

    return formErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      fetch(`https://blog-backend-xlw9.onrender.com/posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then(response => response.json())
        .then(() => navigate('/my-blogs'))
        .catch(error => console.error('Error updating post:', error))
        .finally(() => setLoading(false));
    } else {
      setErrors(formErrors);
      setLoading(false);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <>
      <div className={`form-container ${loading ? 'blur-background' : ''}`}>
        <h2>Edit Blog Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className='form-label'>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="error">{errors.title}</p>}
          </div>
          <div className="form-group">
            <label className='form-label'>Body</label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
            />
            {errors.body && <p className="error">{errors.body}</p>}
          </div>
          <div className="form-group">
            <label className='form-label'>Read Time (in minutes)</label>
            <input
              type="number"
              name="readTime"
              value={formData.readTime}
              onChange={handleChange}
            />
            {errors.readTime && <p className="error">{errors.readTime}</p>}
          </div>
          <div className="form-group">
            <label className='form-label'>Excerpt</label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleChange}
            />
            {errors.excerpt && <p className="error">{errors.excerpt}</p>}
          </div>
          <button type="submit" className='Post-Button'>
            {loading ? 'Updating Post...' : 'Update Post'}
          </button>
        </form>
      </div>
    </>
  );
}

export default EditPost;
