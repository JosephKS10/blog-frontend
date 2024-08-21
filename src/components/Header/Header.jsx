import React, { useContext, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import AuthContext from '../../contexts/AuthContext';
import './Header.css';

const Header = () => {
  const { token, handleLogout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleMyBlogs = () => {
    navigate('/my-blogs'); // Navigate to the My Blogs page
    setDropdownVisible(false); // Close the dropdown
  };

  return (
    <header className="header">
      <Link to="/" className='link'>
        <div className="logo-container">
          <FontAwesomeIcon icon={faLeaf} className="logo" />
          <h1 className="company-name">Random Blog</h1>
        </div>
      </Link>
      <div className="button-container">
        {!token ? (
          <>
            <Link to="/login">
              <button className="button black">Log In</button>
            </Link>
            <Link to="/register">
              <button className="button">Sign Up</button>
            </Link>
          </>
        ) : (
          <>
            <div className="profile-container">
              <img
                src={user?.profilePicture || '/default-profile.png'}
                alt="Profile"
                className="profile-picture"
                onClick={toggleDropdown}
              />
              {dropdownVisible && (
                <div className="dropdown">
                  <p><strong>{user?.name}</strong></p>
                  <p>{user?.email}</p>
                  <p>{user?.bio}</p>
                  <button className="button" onClick={handleMyBlogs}>My Blogs</button> {/* My Blogs Button */}
                  <button className="button" onClick={handleLogout}>Log Out</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
