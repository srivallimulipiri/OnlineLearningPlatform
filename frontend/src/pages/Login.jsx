// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import './Auth.css';

const Login = () => {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      login(response.data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setLoading(true);
    setError('');
    
    const demoCredentials = {
      student: { email: 'student@demo.com', password: 'demo123' },
      teacher: { email: 'teacher@demo.com', password: 'demo123' },
      admin: { email: 'admin@demo.com', password: 'demo123' }
    };

    try {
      const response = await api.post('/auth/login', demoCredentials[role]);
      login(response.data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Demo login failed. Please try manual login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left Side - Branding */}
        <div className="auth-brand-side">
          <div className="brand-content">
            <div className="brand-logo">
              <span className="brand-icon">🎓</span>
              <h1>SkillSphere</h1>
            </div>
            <h2 className="brand-tagline">Welcome Back!</h2>
            <p className="brand-description">
              Continue your learning journey with thousands of courses and expert instructors.
            </p>
            
            <div className="feature-highlights">
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <span>Access to 500+ courses</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏆</span>
                <span>Industry-recognized certificates</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>Join 50,000+ learners</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Learn at your own pace</span>
              </div>
            </div>

            <div className="demo-section">
              <p className="demo-title">Try Demo Accounts:</p>
              <div className="demo-buttons">
                <button 
                  onClick={() => handleDemoLogin('student')}
                  className="demo-btn student"
                  disabled={loading}
                >
                  Student Demo
                </button>
                <button 
                  onClick={() => handleDemoLogin('teacher')}
                  className="demo-btn teacher"
                  disabled={loading}
                >
                  Teacher Demo
                </button>
                <button 
                  onClick={() => handleDemoLogin('admin')}
                  className="demo-btn admin"
                  disabled={loading}
                >
                  Admin Demo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <div className="form-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-container">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-content">
                    <span className="spinner"></span>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="social-login">
              <div className="divider">
                <span>Or continue with</span>
              </div>
              <div className="social-buttons">
                <button className="social-btn google" disabled={loading}>
                  <span className="social-icon">🔍</span>
                  Google
                </button>
                <button className="social-btn github" disabled={loading}>
                  <span className="social-icon">🐙</span>
                  GitHub
                </button>
              </div>
            </div>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <Link to="/register" className="auth-link">
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
