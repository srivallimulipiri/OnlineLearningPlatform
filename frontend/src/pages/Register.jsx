// src/pages/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import './Auth.css';

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    agreeToTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });
      login(response.data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
            <h2 className="brand-tagline">Start Your Journey!</h2>
            <p className="brand-description">
              Join thousands of learners and unlock your potential with our comprehensive courses.
            </p>
            
            <div className="feature-highlights">
              <div className="feature-item">
                <span className="feature-icon">🚀</span>
                <span>Get started in minutes</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">💡</span>
                <span>Learn from industry experts</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>Achieve your goals faster</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🌟</span>
                <span>Build your portfolio</span>
              </div>
            </div>

            <div className="stats-preview">
              <div className="stat-item">
                <span className="stat-number">50K+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Courses</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">4.8★</span>
                <span className="stat-label">Rating</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="auth-form-side">
          <div className="auth-form-container">
            <div className="form-header">
              <h2>Create Account</h2>
              <p>Fill in your information to get started</p>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-container">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

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

              <div className="form-row">
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
                      placeholder="Create password"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="input-container">
                    <span className="input-icon">🔒</span>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm password"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="role">I want to join as</label>
                <div className="role-selection">
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={formData.role === 'student'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <div className="role-card">
                      <span className="role-icon">🎓</span>
                      <span className="role-title">Student</span>
                      <span className="role-desc">Learn new skills</span>
                    </div>
                  </label>
                  <label className="role-option">
                    <input
                      type="radio"
                      name="role"
                      value="teacher"
                      checked={formData.role === 'teacher'}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <div className="role-card">
                      <span className="role-icon">👨‍🏫</span>
                      <span className="role-title">Teacher</span>
                      <span className="role-desc">Share knowledge</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <span className="checkmark"></span>
                  I agree to the{' '}
                  <Link to="/terms" className="terms-link">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                </label>
              </div>

              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-content">
                    <span className="spinner"></span>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="social-login">
              <div className="divider">
                <span>Or sign up with</span>
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
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
