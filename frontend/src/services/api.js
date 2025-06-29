import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  let user = {};
  try {
    const stored = localStorage.getItem('user');
    const parsed = stored && stored !== 'null' ? JSON.parse(stored) : {};
    user = parsed || {};
  } catch (err) {
    user = {};
  }

  if (user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Modular API exports
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  profile: () => api.get('/auth/profile'),
};

export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getById: (id) => api.get(`/courses/${id}`),
  enroll: (id) => api.post(`/courses/${id}/enroll`),
  // FIX: Use correct endpoint for teacher's courses
  getTeacherCourses: () => api.get('/courses/teacher/my-courses'),
  create: (data) => api.post('/courses', data),
  delete: (id) => api.delete(`/courses/${id}`),
  update: (id, data) => api.put(`/courses/${id}`, data),
  addSection: (courseId, data) => api.post(`/courses/${courseId}/sections`, data),
  updateSection: (courseId, sectionId, data) => api.put(`/courses/${courseId}/sections/${sectionId}`, data),
  deleteSection: (courseId, sectionId) => api.delete(`/courses/${courseId}/sections/${sectionId}`),
  addLesson: (courseId, sectionId, data) => api.post(`/courses/${courseId}/sections/${sectionId}/lessons`, data),
  updateLesson: (courseId, sectionId, lessonId, data) => api.put(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`, data),
  deleteLesson: (courseId, sectionId, lessonId) => api.delete(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`),
};

export default api;
