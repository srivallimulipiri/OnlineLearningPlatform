import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasRole } from '../utils/auth';
import LoadingSkeleton from './LoadingSkeleton';

const ProtectedRoute = ({ children, requiredRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user account is active
  if (user && !user.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Deactivated</h2>
          <p className="text-gray-600 mb-4">
            Your account has been deactivated. Please contact support for assistance.
          </p>
          <button
            onClick={() => window.location.href = 'mailto:support@learnhub.com'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  // Check role-based access
  if (requiredRoles && !hasRole(user, requiredRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Role-specific route components
export const StudentRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['student']}>
    {children}
  </ProtectedRoute>
);

export const TeacherRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['teacher', 'admin']}>
    {children}
  </ProtectedRoute>
);

export const AdminRoute = ({ children }) => (
  <ProtectedRoute requiredRoles={['admin']}>
    {children}
  </ProtectedRoute>
);

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <LoadingSkeleton />;
  }
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

export default ProtectedRoute;

export default ProtectedRoute;
