import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          const response = await fetch('https://blog-backend-xlw9.onrender.com/auth/validate-token', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error('Token is invalid or expired');
          }
          setIsLoading(false);
        } catch (error) {
          console.error('Token validation failed:', error);
          handleLogout(); // If token is invalid, log out the user
        }
      } else {
        setIsLoading(false);
      }
    };

    validateToken();
  }, [token]);

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    navigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  const isAuthenticated = () => !!token;

  return (
    <AuthContext.Provider value={{ token, handleLogin, handleLogout, isAuthenticated, isLoading }}>
      {isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
