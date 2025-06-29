// src/pages/Home.jsx
import React from 'react';
import './Home.css'; // CSS file

const quotes = [
  "Transform Your Career with Expert-Led Courses",
  "Learn Today's Most In-Demand Skills",
];

const courses = [
  {
    id: 1,
    title: "React Development Masterclass",
    description: "Build modern web applications with React, hooks, and state management",
    instructor: "Sarah Johnson",
    duration: "8 weeks",
    level: "Beginner",
    price: 99,
    originalPrice: 149,
    rating: 4.8,
    students: 2340,
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["Frontend", "JavaScript", "React"]
  },
  {
    id: 2,
    title: "Full Stack Web Development",
    description: "Complete bootcamp covering frontend, backend, and deployment",
    instructor: "Mike Chen",
    duration: "16 weeks",
    level: "Intermediate",
    price: 299,
    originalPrice: 399,
    rating: 4.9,
    students: 1890,
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["Full Stack", "Node.js", "Database"]
  },
  {
    id: 3,
    title: "AI & Machine Learning Fundamentals",
    description: "Introduction to AI, ML algorithms, and practical applications",
    instructor: "Dr. Emily Rodriguez",
    duration: "12 weeks",
    level: "Beginner",
    price: 199,
    originalPrice: 279,
    rating: 4.7,
    students: 3120,
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=2500&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    tags: ["AI", "Python", "Data Science"]
  }
];
const features = [
  {
    icon: "🎓",
    title: "Expert Instructors",
    description: "Learn from industry professionals with 10+ years experience"
  },
  {
    icon: "🎯",
    title: "Project-Based Learning",
    description: "Build real projects that showcase your skills to employers"
  },
  {
    icon: "🏆",
    title: "Industry Certificates",
    description: "Earn certificates recognized by top tech companies"
  },
  {
    icon: "💬",
    title: "24/7 Support",
    description: "Get help whenever you need it from our community"
  }
];

const Home = () => {
  const [currentQuote, setCurrentQuote] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">{quotes[currentQuote]}</h1>
            <p className="hero-subtitle">
              Master in-demand skills with hands-on projects, expert mentorship, and industry-recognized certificates
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary">Start Learning Today</button>
              <button className="btn btn-secondary">Browse Free Courses</button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stars">⭐⭐⭐⭐⭐</span>
                <span>4.8/5 from 10k+ reviews</span>
              </div>
              <div className="stat-item">50,000+ active learners</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why SkillSphere Stands Out</h2>
            <p>We're committed to providing the best online learning experience</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Courses */}
      <section className="courses-section">
        <div className="container">
          <div className="section-header">
            <h2>Most Popular Courses</h2>
            <p>Join thousands of students in our top-rated courses</p>
          </div>

          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <div className="course-image">
                  <img src={course.image} alt={course.title} />
                  <div className="course-badges">
                    <span className="level-badge">{course.level}</span>
                  </div>
                  <div className="price-badge">
                    <div className="current-price">${course.price}</div>
                    <div className="original-price">${course.originalPrice}</div>
                  </div>
                </div>

                <div className="course-content">
                  <div className="course-tags">
                    {course.tags.map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>

                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>

                  <div className="course-meta">
                    <div className="instructor">
                      <span>👨‍🏫 {course.instructor}</span>
                    </div>
                    <div className="duration">
                      <span>⏱️ {course.duration}</span>
                    </div>
                  </div>

                  <div className="course-stats">
                    <div className="rating">
                      <span className="stars">⭐⭐⭐⭐⭐</span>
                      <span className="rating-number">{course.rating}</span>
                      <span className="students-count">({course.students.toLocaleString()})</span>
                    </div>
                  </div>

                  <button className="btn btn-enroll">Enroll Now</button>
                </div>
              </div>
            ))}
          </div>

          
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>SkillSphere</h3>
              <p>Empowering learners worldwide with cutting-edge skills and knowledge.</p>
            </div>
            <div className="footer-section">
              <h4>Courses</h4>
              <ul>
                <li>Web Development</li>
                <li>Data Science</li>
                <li>Mobile Development</li>
                <li>AI & Machine Learning</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Company</h4>
              <ul>
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Blog</li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li>Help Center</li>
                <li>Community</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 SkillSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
