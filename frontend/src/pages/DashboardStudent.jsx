// src/pages/DashboardStudent.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './Dashboard.css';

function DashboardStudent() {
  const { user } = useAuth();

  const enrolledCourses = [
    { 
      id: 1, 
      title: "React Development Masterclass", 
      progress: 75, 
      nextLesson: "State Management with Redux",
      instructor: "Sarah Johnson",
      totalLessons: 24,
      completedLessons: 18,
      estimatedTime: "2h 30m remaining",
      category: "Frontend",
      difficulty: "Intermediate"
    },
    { 
      id: 2, 
      title: "JavaScript Advanced Concepts", 
      progress: 30, 
      nextLesson: "Closures and Scope",
      instructor: "Mike Chen",
      totalLessons: 20,
      completedLessons: 6,
      estimatedTime: "8h 15m remaining",
      category: "Programming",
      difficulty: "Advanced"
    },
    { 
      id: 3, 
      title: "Node.js Backend Development", 
      progress: 90, 
      nextLesson: "Final Project Setup",
      instructor: "Dr. Emily Rodriguez",
      totalLessons: 16,
      completedLessons: 14,
      estimatedTime: "45m remaining",
      category: "Backend",
      difficulty: "Intermediate"
    }
  ];

  const recentAchievements = [
    { title: "JavaScript Fundamentals", date: "2 days ago", type: "completion" },
    { title: "React Hooks Mastery", date: "1 week ago", type: "milestone" },
    { title: "First Course Completed", date: "2 weeks ago", type: "achievement" }
  ];

  const totalCourses = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(course => course.progress === 100).length;
  const averageProgress = totalCourses > 0
    ? (enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / totalCourses).toFixed(0)
    : 0;

  const totalHoursLearned = 47; // This would come from your backend
  const streakDays = 12; // This would come from your backend

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="dashboard-title">Student Dashboard</h1>
            <div className="user-greeting">
              <span className="greeting-text">Welcome back, </span>
              <span className="user-name">{user?.name}!</span>
            </div>
            <p className="user-email">{user?.email}</p>
          </div>
          <div className="header-actions">
            <Link to="/browse" className="btn btn-primary">
              <span className="btn-icon">🔍</span>
              Browse Courses
            </Link>
            <Link to="/profile" className="btn btn-secondary">
              <span className="btn-icon">👤</span>
              My Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-number">{totalCourses}</div>
              <div className="stat-label">Enrolled Courses</div>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-number">{completedCourses}</div>
              <div className="stat-label">Completed Courses</div>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-number">{averageProgress}%</div>
              <div className="stat-label">Average Progress</div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-number">{totalHoursLearned}h</div>
              <div className="stat-label">Hours Learned</div>
            </div>
          </div>
          
          <div className="stat-card purple">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-number">{streakDays}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Current Courses */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Continue Learning</h2>
            <Link to="/my-courses" className="section-link">View All Courses</Link>
          </div>
          
          <div className="courses-grid">
            {enrolledCourses.map(course => (
              <div key={course.id} className="course-card">
                <div className="course-header">
                  <div className="course-category">{course.category}</div>
                  <div className="course-difficulty">{course.difficulty}</div>
                </div>
                
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-instructor">👨‍🏫 {course.instructor}</p>
                  
                  <div className="progress-section">
                    <div className="progress-info">
                      <span className="progress-text">{course.progress}% Complete</span>
                      <span className="lessons-count">{course.completedLessons}/{course.totalLessons} lessons</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="next-lesson">
                    <span className="next-lesson-label">Next:</span>
                    <span className="next-lesson-title">{course.nextLesson}</span>
                  </div>
                  
                  <div className="course-meta">
                    <span className="time-remaining">{course.estimatedTime}</span>
                  </div>
                </div>
                
                <div className="course-actions">
                  <Link to={`/course/${course.id}`} className="btn btn-course-primary">
                    Continue Learning
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Recent Achievements</h2>
            <Link to="/achievements" className="section-link">View All</Link>
          </div>
          
          <div className="achievements-grid">
            {recentAchievements.map((achievement, index) => (
              <div key={index} className="achievement-card">
                <div className="achievement-icon">
                  {achievement.type === 'completion' && '🏆'}
                  {achievement.type === 'milestone' && '🎯'}
                  {achievement.type === 'achievement' && '⭐'}
                </div>
                <div className="achievement-content">
                  <h4 className="achievement-title">{achievement.title}</h4>
                  <p className="achievement-date">{achievement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          
          <div className="quick-actions-grid">
            <Link to="/browse" className="quick-action-card">
              <div className="quick-action-icon">🔍</div>
              <div className="quick-action-content">
                <h4>Browse Courses</h4>
                <p>Discover new learning opportunities</p>
              </div>
            </Link>
            
            <Link to="/certificates" className="quick-action-card">
              <div className="quick-action-icon">📜</div>
              <div className="quick-action-content">
                <h4>My Certificates</h4>
                <p>View your earned certificates</p>
              </div>
            </Link>
            
            <Link to="/progress" className="quick-action-card">
              <div className="quick-action-icon">📊</div>
              <div className="quick-action-content">
                <h4>Learning Analytics</h4>
                <p>Track your learning progress</p>
              </div>
            </Link>
            
            <Link to="/settings" className="quick-action-card">
              <div className="quick-action-icon">⚙️</div>
              <div className="quick-action-content">
                <h4>Settings</h4>
                <p>Customize your experience</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardStudent;
