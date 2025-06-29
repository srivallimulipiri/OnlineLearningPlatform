import React, { useState } from 'react';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaUserTag } from 'react-icons/fa';

const AuthForm = ({ type, onSubmit, loading = false, disabled = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (type === 'register' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (type === 'register') {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm() && !loading) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {type === 'register' && (
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-neutral-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`modern-input pl-12 ${errors.name ? 'border-danger-500' : ''}`}
              placeholder="Enter your full name"
              disabled={disabled}
            />
            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          </div>
          {errors.name && <p className="mt-1 text-sm text-danger-600">{errors.name}</p>}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`modern-input pl-12 ${errors.email ? 'border-danger-500' : ''}`}
            placeholder="Enter your email"
            disabled={disabled}
          />
          <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
        </div>
        {errors.email && <p className="mt-1 text-sm text-danger-600">{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-neutral-700 mb-2">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`modern-input pl-12 pr-12 ${errors.password ? 'border-danger-500' : ''}`}
            placeholder="Enter your password"
            disabled={disabled}
          />
          <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
            disabled={disabled}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-danger-600">{errors.password}</p>}
      </div>

      {type === 'register' && (
        <>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-neutral-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`modern-input pl-12 pr-12 ${errors.confirmPassword ? 'border-danger-500' : ''}`}
                placeholder="Confirm your password"
                disabled={disabled}
              />
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
                disabled={disabled}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="mt-1 text-sm text-danger-600">{errors.confirmPassword}</p>}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-semibold text-neutral-700 mb-2">
              I want to join as
            </label>
            <div className="relative">
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="modern-select pl-12"
                disabled={disabled}
              >
                <option value="student">Student - Learn new skills</option>
                <option value="teacher">Teacher - Share your knowledge</option>
              </select>
              <FaUserTag className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            </div>
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={loading || disabled}
        className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 disabled:transform-none"
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>{type === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
          </div>
        ) : (
          type === 'login' ? 'Sign In' : 'Create Account'
        )}
      </button>
    </form>
  );
};

export default AuthForm;
