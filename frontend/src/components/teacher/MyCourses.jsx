// src/components/teacher/MyCourses.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';

const MyCourses = () => {
  const { user } = useAuth();
  const { notify } = useNotification();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`/api/courses/teacher/my-courses`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCourses(res.data.courses || []);
      } catch (err) {
        notify.error('Failed to fetch courses');
      }
    };
    if (user?._id) fetchCourses();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await courseAPI.delete(id);
      setCourses(prev => prev.filter(course => course._id !== id));
      notify.success('Course deleted');
    } catch (err) {
      notify.showError('Failed to delete course');
    }
  };

  return (
    <div className="my-courses p-6">
      <h2 className="text-2xl font-bold mb-4">📚 My Courses</h2>
      {courses.length === 0 ? (
        <p className="text-gray-600">You haven't created any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-lg shadow p-4">
              <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{course.category} | {course.level}</p>
              <p className="text-sm mt-1">Price: ₹{course.price}</p>
              <p className="text-sm mt-1">Instructor: {course.instructor?.name || 'N/A'}</p>
              <div className="flex justify-between items-center mt-4">
                <Link
                  to={`/teacher/edit-course/${course._id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  ✏️ Modify
                </Link>
                <button
                  onClick={() => handleDelete(course._id)}
                  className="text-red-600 hover:underline font-medium"
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
