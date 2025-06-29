// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import CourseDetail from './pages/CourseDetail';
import Profile from './pages/Profile';
import MyCourses from './pages/MyCourses';
import CreateCourse from './components/teacher/CreateCourse';
import Analytics from './pages/Analytics';

import DashboardTeacher from './components/teacher/TeacherDashboard';
import DashboardStudent from './pages/DashboardStudent';
import DashboardAdmin from './pages/DashboardAdmin';

import MainLayout from './components/common/MainLayout';
import { useAuth } from './hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const getDashboard = (user) => {
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'teacher':
      return <DashboardTeacher />;
    case 'student':
      return <DashboardStudent />;
    case 'admin':
      return <DashboardAdmin />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout showSidebar={false}><Home /></MainLayout>} />
        <Route path="/browse" element={<MainLayout><Browse /></MainLayout>} />
        <Route path="/course/:id" element={<MainLayout><CourseDetail /></MainLayout>} />

        {/* Auth Routes - NOW WITH MAINLAYOUT */}
        <Route path="/login" element={
          <PublicRoute>
            <MainLayout showSidebar={false}>
              <Login />
            </MainLayout>
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <MainLayout showSidebar={false}>
              <Register />
            </MainLayout>
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>{getDashboard(user)}</MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout><Profile /></MainLayout>
          </ProtectedRoute>
        } />

        <Route path="/my-courses" element={
          <ProtectedRoute>
            <MainLayout><MyCourses /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Teacher Routes */}
        <Route path="/create-course" element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <MainLayout><CreateCourse /></MainLayout>
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/analytics" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <MainLayout><Analytics /></MainLayout>
          </ProtectedRoute>
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <MainLayout showSidebar={false}>
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-neutral-300">404</h1>
                <p className="text-xl text-neutral-600 mt-4">Page not found</p>
                <button 
                  onClick={() => window.history.back()}
                  className="btn-primary mt-6"
                >
                  Go Back
                </button>
              </div>
            </div>
          </MainLayout>
        } />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AppContent />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
