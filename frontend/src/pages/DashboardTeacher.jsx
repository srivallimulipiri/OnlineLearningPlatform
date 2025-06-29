import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import {
  FaBook,
  FaUserGraduate,
  FaDollarSign,
  FaStar,
  FaPlusCircle,
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { courseAPI } from '../services/api';
import LoadingSkeleton from '../components/LoadingSkeleton';
import Toast from '../components/Toast';
import './DashboardTeacher.css';

function DashboardTeacher() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  const fetchTeacherCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await courseAPI.getTeacherCourses();
      setCourses(response.data.data.courses);
    } catch (err) {
      console.error('Failed to fetch teacher courses:', err);
      setError('Failed to load courses. Please try again.');
      setToast({ show: true, message: 'Failed to load courses.', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeacherCourses();
  }, [fetchTeacherCourses]);

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await courseAPI.delete(courseId);
        setToast({ show: true, message: 'Course deleted successfully!', type: 'success' });
        fetchTeacherCourses(); // Refresh the list
      } catch (err) {
        console.error('Failed to delete course:', err);
        const message = err.response?.data?.message || 'Failed to delete course.';
        setError(message);
        setToast({ show: true, message: message, type: 'error' });
      }
    }
  };

  const totalStudents = courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0);
  const totalRevenue = courses.reduce((sum, course) => sum + (course.price * (course.enrolledStudents?.length || 0)), 0);
  const avgRating = courses.length > 0 ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1) : 0;

  if (loading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="teacher-dashboard">
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
      {/* Top Section */}
      <div className="dashboard-top">
        <div>
          <h1 className="dashboard-heading">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
          <p className="dashboard-subtext">Keep up the great work. Your students are thriving!</p>
        </div>
        <Link to="/create-course" className="btn-create-course">
          <FaPlusCircle /> New Course
        </Link>
      </div>

      {/* Stats Section */}
      <div className="dashboard-stats">
        <StatsCard 
          title="Total Courses" 
          value={courses.length}
          icon={<FaBook />}
          color="primary"
        />
        <StatsCard 
          title="Total Students" 
          value={totalStudents.toLocaleString()}
          icon={<FaUserGraduate />}
          color="success"
        />
        <StatsCard 
          title="Total Revenue" 
          value={`${totalRevenue.toLocaleString()}`}
          icon={<FaDollarSign />}
          color="info"
        />
        <StatsCard 
          title="Avg Rating" 
          value={avgRating}
          icon={<FaStar />}
          color="warning"
        />
      </div>

      {/* Courses Table */}
      <div className="dashboard-courses">
        <h2>My Courses</h2>
        <div className="table-wrapper">
          <table className="courses-table">
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Students</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">You haven't created any courses yet.</td>
                </tr>
              ) : (
                courses.map(course => (
                  <tr key={course._id}>
                    <td>{course.title}</td>
                    <td>{course.enrolledStudents?.length || 0}</td>
                    <td>${course.price.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${course.isPublished ? 'published' : 'draft'}`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="table-actions">
                      <Link to={`/teacher/courses/${course._id}/edit`} className="edit-link">Edit</Link>
                      <button onClick={() => handleDeleteCourse(course._id)} className="delete-link">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default DashboardTeacher;
