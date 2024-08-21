import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-left">
          <div className="footer-logo">
            <FontAwesomeIcon icon={faLeaf} className="logo" />
            <h2 className="company-name">Random Blog</h2>
          </div>
          <p className="about-text">
            Random Blog is your go-to platform for insightful articles on various topics. Join our community and share your thoughts!
          </p>
        </div>
        <div className="footer-right">
          <div className="footer-column">
            <h4>Explore</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Blogs</a></li>
              <li><a href="#">Post a Blog</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p className="copyright">&copy; 2024 Random Blog. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
