import React, { useState } from 'react';
import '../styles/AdminLogin.css'; // CSS file for styling
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const hardcodedAdmin = {
    email: 'admin@tuimate.com',
    password: 'admin123'
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('All fields are required');
      return;
    }

    if (email === hardcodedAdmin.email && password === hardcodedAdmin.password) {
      setError('');
      navigate('/dashboard'); // Redirect to Admin Dashboard
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="admin-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-input"
          />
          <button type="submit" className="admin-login-button">Login</button>
        </form>
      </div>
    </div>
  );
}
