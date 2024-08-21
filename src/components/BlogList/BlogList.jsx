import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../contexts/AuthContext'; // Update the path as needed
import './BlogList.css';

const BlogList = () => {
  const { token } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [category, setCategory] = useState('all'); 
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const postsPerPage = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await fetch('https://blog-backend-xlw9.onrender.com/posts', {
          headers: {
            'Authorization': `Bearer ${token}`, // Include token in the request headers
          },
        });
        const data = await response.json();
        setPosts(data);
        filterAndSortPosts(category, sortOrder, data); // Pass the fetched data directly
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
  
    fetchPosts();
  }, [token, category, sortOrder]);

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
    filterAndSortPosts(selectedCategory, sortOrder);
    setCurrentPage(1); // Reset to first page when category changes
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    filterAndSortPosts(category, event.target.value);
    setCurrentPage(1); 
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    filterAndSortPosts(category, sortOrder, posts, e.target.value); // Update filtering based on search input
  };

  const filterAndSortPosts = (selectedCategory, selectedSortOrder, postsToFilter, searchQuery = '') => {
    let filtered = postsToFilter;
    
    if (selectedCategory !== 'all') {
      filtered = postsToFilter.filter(post => post.Category.toLowerCase() === selectedCategory.toLowerCase());
    }
  
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.Excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.Body.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    if (selectedSortOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.PostDate) - new Date(a.PostDate));
    } else {
      filtered.sort((a, b) => new Date(a.PostDate) - new Date(b.PostDate));
    }
  
    setFilteredPosts(filtered);
    setLoading(false); // Set loading to false once filtering and sorting are done
  };
  

  
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);


  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();
  
    return `${day} ${month} ${year}`;
  }

  return (
    <div className="blog-list-container">
      <h2 data-testid="blog-list-title" className="blog-list-title">Blogs</h2>
      <p className="blog-list-description">Explore our latest articles on destinations, culture, lifestyle, and more.</p>
      <input
          type="text"
          className="blog-search-bar"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={handleSearchChange}
          data-testid="blog-search-bar"
        />
      <div data-testid="blog-categories-bar" className="blog-categories-bar">
  
        <div className="categories">
          <button onClick={() => handleCategoryChange('all')}>All</button>
          <button onClick={() => handleCategoryChange('Web Development')}>Web Development</button>
          <button onClick={() => handleCategoryChange('Database')}>Database</button>
          <button onClick={() => handleCategoryChange('Backend Development')}>Backend Development</button>
          <button onClick={() => handleCategoryChange('Data Science')}>Data Science</button>
          <button onClick={() => handleCategoryChange('Mobile Development')}>Mobile Development</button>
          <button onClick={() => handleCategoryChange('DevOps')}>DevOps</button>
        </div>
        <div className="sort-dropdown">
          <Link to="/create" className="create-blog-button">Create Blog</Link>
          <select value={sortOrder} onChange={handleSortOrderChange}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <>
          <div data-testid="blog-tiles" className="blog-tiles">
            {currentPosts.map(post => (
              <Link to={`/post/${post._id}`} key={post.id} className="blog-tile">
                <div className="blog-image-container">
                  <img src={post.FeaturedImageURL} alt="Blog" className="blog-image" />
                  <span className="blog-category-label">{post.Category}</span>
                </div>
                <div className="blog-meta">
                  <span className="blog-date">{formatDate(post.PostDate)}</span>
                  <span className="blog-read-time">{post.ReadTime} mins</span>
                </div>
                <h3 className="blog-title">{post.Title}</h3>
                <p className="blog-excerpt">{post.Excerpt.split('\n')[0]}...</p> 
                <div className="blog-author">
                  <img src={post.AuthorImageURL} alt="Author" className="author-photo" />
                  <span className="author-name">{post.AuthorName}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredPosts.length / postsPerPage) }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => paginate(index + 1)}
                className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogList;
