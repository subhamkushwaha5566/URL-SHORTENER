import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiLock, FiMail } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
      const response = await axios.post(`${API_URL}/user/login`, {
        email,
        password,
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center">
      <div className="col-12 col-md-5 col-lg-4 z-1">
        
        <div className="text-center mb-5">
          <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle mb-3 shadow-sm" style={{ width: '64px', height: '64px', border: '1px solid var(--border-subtle)' }}>
            <FiLock size={28} color="var(--accent-primary)" />
          </div>
          <h2 className="fw-bold mb-1">Welcome back</h2>
          <p className="text-muted-light small">Log in to your URL dashboard</p>
        </div>

        <div className="light-card p-4 p-md-5">
          {error && (
            <div className="alert alert-danger font-mono small py-2 mb-4" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--error-color)', color: 'var(--error-color)' }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="form-label small text-muted-light fw-bold mb-2">EMAIL ADDRESS</label>
              <div className="position-relative">
                <FiMail className="position-absolute top-50 translate-middle-y ms-3 text-muted-light" />
                <input
                  type="email"
                  className="w-100 light-input ps-5 font-mono"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="mb-4 mt-2">
              <label className="form-label small text-muted-light fw-bold mb-2">PASSWORD</label>
              <div className="position-relative">
                <FiLock className="position-absolute top-50 translate-middle-y ms-3 text-muted-light" />
                <input
                  type="password"
                  className="w-100 light-input ps-5 font-mono"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary-light w-100 mt-2"
              disabled={isLoading}
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-4 text-muted-light small">
          Don't have an account? 
          <Link to="/signup" className="text-decoration-none fw-bold ms-1" style={{ color: 'var(--accent-primary)' }}>
            Create one now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
