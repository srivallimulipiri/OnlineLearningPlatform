
// src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDashboardRoute } from '../utils/auth';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      const dashboardRoute = getDashboardRoute(user.role);
      navigate(dashboardRoute, { replace: true });
    } else if (!loading && !user) {
      // If no user, redirect to login
      navigate('/login', { replace: true });
    }
  }, [user, loading, navigate]);

  // Render a loading state while checking user auth
  return <LoadingSkeleton />;
};

export default Dashboard;
