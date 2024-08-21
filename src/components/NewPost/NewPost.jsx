import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../contexts/AuthContext'; 
import './NewPost.css';
import { faL } from '@fortawesome/free-solid-svg-icons';

const NewPost = () => {
  const { token } = useContext(AuthContext); 
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [featuredImageURL, setFeaturedImageURL] = useState('https://via.placeholder.com/600x400');
  const [category, setCategory] = useState('');
  const [postDate, setPostDate] = useState('');
  const [readTime, setReadTime] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'Web Development',
    'Database',
    'Backend Development',
    'Data Science',
    'Mobile Development',
    'DevOps'
  ]; 

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setPostDate(today);

    // Fetch user information if token is available
    if (token) {
      fetch('https://blog-backend-xlw9.onrender.com/auth/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Error fetching user data:', error));
    }
  }, [token]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFeaturedImage(file);
    setFeaturedImageURL(URL.createObjectURL(file));
  };

  const validateForm = () => {
    let formErrors = {};
    if (!title.trim()) formErrors.title = 'Title is required';
    else if (title.length < 5) formErrors.title = 'Title must be at least 5 characters long';
    
    if (!body.trim()) formErrors.body = 'Body is required';
    else if (body.length < 20) formErrors.body = 'Body must be at least 20 characters long';
    
    if (!category) formErrors.category = 'Category is required';

    if (featuredImageURL === "https://via.placeholder.com/800x533") formErrors.featuredImageURL = 'Image is required';
    
    if (!readTime) formErrors.readTime = 'Read time is required';
    else if (isNaN(readTime) || readTime <= 0) formErrors.readTime = 'Read time must be a positive number';
    
    if (!excerpt.trim()) formErrors.excerpt = 'Excerpt is required';
    else if (excerpt.length < 10) formErrors.excerpt = 'Excerpt must be at least 10 characters long';
    
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      const tagList = tags.split(',').map(tag => tag.trim());

      const formData = new FormData();
      formData.append('title', title);
      formData.append('body', body);
      formData.append('featuredImage', featuredImage);
      formData.append('category', category);
      formData.append('postDate', postDate);
      formData.append('readTime', readTime);
      formData.append('excerpt', excerpt);
      formData.append('tags', JSON.stringify(tagList));
      formData.append('authorName', user?.name);
      formData.append('authorImageURL', user?.profilePicture || 'https://via.placeholder.com/150');
     
      try {
        console.log(formData)
        const response = await fetch('https://blog-backend-xlw9.onrender.com/posts/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          setShowSuccessModal(true);
          setTitle('');
          setBody('');
          setFeaturedImage(null);
          setFeaturedImageURL('https://via.placeholder.com/800x533'); 
          setCategory('');
          setReadTime('');
          setExcerpt('');
          setTags('');
          setErrors({});
        } else {
          const errorData = await response.json();
          setErrors({ ...errorData, form: 'Failed to submit post. Please try again.' });
        }
      } catch (error) {
        console.error('Error:', error);
        setErrors({ form: 'An error occurred while submitting the post.' });
      }
      finally {
        setLoading(false);
      }
    } else {
      setErrors(formErrors);
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`form-container ${showSuccessModal ? 'blur-background' : ''}`}>
        <h2>Add New Blog Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className='form-label'>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <p className="error">{errors.title}</p>}
          </div>
          <div className="form-group">
            <label className='form-label'>Body</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            {errors.body && <p className="error">{errors.body}</p>}
          </div>
          <div className="form-group">
            <label className='form-label'>Featured Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <img src={featuredImageURL} alt="Preview" className="image-preview" />
            {errors.featuredImageURL && <p className="error">{errors.featuredImageURL}</p>}
          </div>
          <div className="sort-dropdown">
            <label className='form-label'>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select a category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="error">{errors.category}</p>}
          </div><br />
          <div className="form-group">
            <label className='form-label'>Post Date</label>
            <input
              type="date"
              value={postDate}
              readOnly
            />
          </div>
          <div className="form-group">
            <label className='form-label'>Read Time (in minutes)</label>
            <input
              type="number"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
            />
            {errors.readTime && <p className="error">{errors.readTime}</p>}
          </div>
          <div className="form-group">
            <label className='form-label'>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
            {errors.excerpt && <p className="error">{errors.excerpt}</p>}
          </div>
          <div className="form-group">
            <label className='form-label'>Tags (comma-separated, optional)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          
          
          <button type="submit" className='Post-Button'>
          {loading ? 'Submiting Blog...' : 'Post Blog'}
          </button>
        </form>
      </div>
      {showSuccessModal && (
        <div className="success-modal">
          <h3>Success!</h3>
          <p>Your post has been added successfully.</p>
          <button onClick={() => setShowSuccessModal(false)}>Close</button>
        </div>
      )}
    </>
  );
};

export default NewPost;
