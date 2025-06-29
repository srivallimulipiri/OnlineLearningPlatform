// src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.css';

const Navbar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home', public: true },
    { path: '/browse', label: 'Browse Courses', public: true },
    { path: '/dashboard', label: 'Dashboard', protected: true },
    { path: '/my-courses', label: 'My Courses', protected: true },
  ];

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'admin-badge';
      case 'teacher': return 'teacher-badge';
      case 'student': return 'student-badge';
      default: return 'default-badge';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <div className="brand-logo">
            <span className="brand-icon">🎓</span>
            <span className="brand-text">SkillSphere</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-nav desktop-nav">
          {navLinks.map((link) => {
            if (link.protected && !user) return null;
            if (link.public || user) {
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            }
            return null;
          })}
        </div>

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-menu">
              <button
                className="user-profile-btn"
                onClick={toggleProfileDropdown}
              >
                <div className="user-avatar">
                  {getInitials(user.name)}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.name}</span>
                  <span className={`user-role ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </div>
                <svg className="dropdown-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown */}
              {isProfileDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="user-avatar large">
                      {getInitials(user.name)}
                    </div>
                    <div className="user-details">
                      <div className="user-name">{user.name}</div>
                      <div className="user-email">{user.email}</div>
                      <span className={`user-role ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <div className="dropdown-menu">
                    <Link to="/profile" className="dropdown-item">
                      <span className="item-icon">👤</span>
                      Profile Settings
                    </Link>
                    <Link to="/my-courses" className="dropdown-item">
                      <span className="item-icon">📚</span>
                      My Courses
                    </Link>
                    {user.role === 'teacher' && (
                      <Link to="/create-course" className="dropdown-item">
                        <span className="item-icon">➕</span>
                        Create Course
                      </Link>
                    )}
                    {user.role === 'admin' && (
                      <Link to="/analytics" className="dropdown-item">
                        <span className="item-icon">📊</span>
                        Analytics
                      </Link>
                    )}
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <span className="item-icon">🚪</span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" onClick={toggleMenu}>
            <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-nav">
          <div className="mobile-nav-content">
            {navLinks.map((link) => {
              if (link.protected && !user) return null;
              if (link.public || user) {
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`mobile-nav-link ${isActive(link.path) ? 'active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              }
              return null;
            })}
            
            {user ? (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <div className="user-avatar">
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <div className="user-name">{user.name}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                </div>
                <Link to="/profile" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
                  Profile Settings
                </Link>
                <button onClick={handleLogout} className="mobile-nav-link logout">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="mobile-auth-buttons">
                <Link to="/login" className="btn btn-outline" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop for mobile menu and dropdown */}
      {(isMenuOpen || isProfileDropdownOpen) && (
        <div 
          className="backdrop" 
          onClick={() => {
            setIsMenuOpen(false);
            setIsProfileDropdownOpen(false);
          }}
        ></div>
      )}
    </nav>
  );
};

export default Navbar;
