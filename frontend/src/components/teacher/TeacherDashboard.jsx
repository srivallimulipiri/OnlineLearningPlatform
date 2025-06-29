// src/components/teacher/TeacherDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import MyCourses from './MyCourses';
import CreateCourse from './CreateCourse';
//import TeacherStats from './TeacherStats';
//import StudentAnalytics from './StudentAnalytics';
import './TeacherDashboard.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    publishedCourses: 0
  });

  useEffect(() => {
    fetchTeacherStats();
  }, []);

  const fetchTeacherStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/courses/teacher/my-courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const courses = data.data.courses;
        
        const totalStudents = courses.reduce((sum, course) => 
          sum + (course.enrolledStudents?.length || 0), 0
        );
        
        const publishedCourses = courses.filter(course => course.isPublished).length;

        setStats({
          totalCourses: courses.length,
          totalStudents,
          totalRevenue: 0, // Will be calculated from enrollments
          publishedCourses
        });
      }
    } catch (error) {
      console.error('Error fetching teacher stats:', error);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'courses', label: 'My Courses', icon: '📚' },
    { id: 'create', label: 'Create Course', icon: '➕' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="teacher-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p>Manage your courses and track your teaching progress</p>
      </div>

      <div className="dashboard-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="dashboard-content">
       
        {activeTab === 'create' && <CreateCourse onCourseCreated={fetchTeacherStats} />}
        {activeTab === 'courses' && <MyCourses />}

      </div>
    </div>
  );
};

export default TeacherDashboard;
