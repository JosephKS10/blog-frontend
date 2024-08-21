import React, { useState, useContext } from 'react';
import AuthContext from '../../../contexts/AuthContext';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { handleLogin } = useContext(AuthContext);


   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://blog-backend-xlw9.onrender.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      if (response.ok) {
        handleLogin(result.token);
      } else {
        setError(result.message || 'Failed to login');
      }
    } catch (error) {
      setError('An error occurred while logging in');
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className='form-label'>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className='form-label'>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className='Post-Button'>Login</button>
      </form>
    </div>
  );
};

export default Login;
